import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { client } from "@/sanity/lib/client";
import { backendClient } from "@/sanity/lib/backendClient";
import { fetchStripeLineItems, mapLineItemsToOrderItems } from "./helpers";

/**
 * STEP 1: Configure Route
 * This tells Next.js to NOT parse the body as JSON
 * We need the raw body for signature verification
 */
export const runtime = "nodejs";

/**
 * STEP 2: Main Webhook Handler
 */
export async function POST(request: NextRequest) {
  console.log("🔔 Webhook received");

  try {
    // STEP 3: Get raw body and signature
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("❌ No signature found");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // STEP 4: Verify webhook signature
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("❌ STRIPE_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log("✅ Signature verified");
    } catch (err) {
      console.error("❌ Signature verification failed:", err);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err}` },
        { status: 400 }
      );
    }

    // STEP 5: Handle different event types
    console.log(`📨 Event type: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      // Add more event types as needed
      case "payment_intent.succeeded":
        console.log(
          "💰 Payment succeeded (already handled in checkout.session.completed)"
        );
        break;

      default:
        console.log(`🤷 Unhandled event type: ${event.type}`);
    }

    // STEP 6: Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("💥 Webhook error:", error);
    // Still return 200 to prevent Stripe from retrying
    // But log the error for investigation
    return NextResponse.json(
      { error: "Webhook handler failed", details: String(error) },
      { status: 200 } // Note: 200 to stop retries
    );
  }
}

/**
 * STEP 7: Handle Checkout Session Completed
 * This is where the main order processing happens
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  console.log("🛒 Processing checkout session:", session.id);
  console.log("Customer email:", session.customer_email);
  console.log("Amount:", session.amount_total);
  console.log("User ID:", session.metadata?.userId);

  try {
    // STEP 11: Check for duplicate orders (idempotency)
    const existingOrder = await client.fetch(
      `*[_type == "order" && payment.stripeCheckoutSessionId == $sessionId][0]._id`,
      { sessionId: session.id }
    );

    if (existingOrder) {
      console.log("✅ Order already exists for this session:", existingOrder);
      return; // Already processed, skip
    }

    // STEP 12: Fetch line items from Stripe
    const lineItems = await fetchStripeLineItems(session.id);

    if (!lineItems || lineItems.length === 0) {
      throw new Error("No line items found in session");
    }

    // STEP 13: Map to order items with product details
    const orderItems = await mapLineItemsToOrderItems(lineItems);

    if (!orderItems || orderItems.length === 0) {
      throw new Error("Failed to map line items to order items");
    }

    // STEP 14: Build order data
    const now = new Date().toISOString();
    const orderNumber = await generateOrderNumber();

    const orderData = {
      _type: "order",

      // Identifiers
      orderNumber,
      orderId: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,

      // Customer info
      clerkUserId: session.metadata?.userId,
      customerEmail: session.customer_email,
      isGuest: !session.metadata?.userId,

      // Items
      items: orderItems.map((item) => ({
        productRef: { _type: "reference", _ref: item.productId },
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
        returnStatus: "none",
      })),

      // Pricing
      pricing: {
        subtotal: (session.amount_subtotal || 0) / 100,
        shipping: 0,
        tax: (session.total_details?.amount_tax || 0) / 100,
        total: (session.amount_total || 0) / 100,
        currency: session.currency?.toUpperCase() || "USD",
      },

      // Status
      status: "processing",

      // Dates
      dates: {
        orderedAt: now,
        paidAt: now,
      },

      // Payment
      payment: {
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
        method: "card",
      },

      // Metadata
      metadata: {
        source: "web",
      },
    };

    // STEP 15: Create order in Sanity
    console.log("💾 Creating order in Sanity...");
    const createdOrder = await backendClient.create(orderData);
    console.log("✅ Order created:", createdOrder._id, orderNumber);

    // STEP 16: Decrement stock for each item
    console.log("📉 Decrementing stock...");
    for (const item of orderItems) {
      await backendClient
        .patch(item.productId)
        .dec({ stock: item.quantity })
        .commit();
      console.log(`  ✓ Decremented stock for ${item.name} by ${item.quantity}`);
    }

    // STEP 17: Save payment method if user opted in
    await savePaymentMethodIfRequested(session);

    console.log("🎉 Order processing complete!");
  } catch (error) {
    console.error("💥 Error processing order:", error);
    throw error; // Re-throw to be caught by main handler
  }
}

/**
 * STEP 17: Generate unique order number
 */
async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const orderCount = await client.fetch<number>(
    `count(*[_type == "order" && dates.orderedAt >= $yearStart])`,
    {
      yearStart: `${year}-01-01T00:00:00.000Z`,
    }
  );
  const orderNum = String(orderCount + 1).padStart(4, "0");
  return `ORD-${year}-${orderNum}`;
}

/**
 * STEP 18: Save payment method if user opted to save it
 */
async function savePaymentMethodIfRequested(session: Stripe.Checkout.Session) {
  try {
    // Only proceed if user is logged in
    if (!session.metadata?.userId) {
      console.log("⏭️  Guest checkout - skipping payment method save");
      return;
    }

    // Retrieve the payment intent to get the payment method
    const paymentIntentId = session.payment_intent as string;
    if (!paymentIntentId) {
      console.log("⚠️  No payment intent found");
      return;
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Check if payment method should be saved (setup_future_usage was set)
    if (!paymentIntent.setup_future_usage) {
      console.log("⏭️  User did not opt to save payment method");
      return;
    }

    const paymentMethodId = paymentIntent.payment_method as string;
    if (!paymentMethodId) {
      console.log("⚠️  No payment method ID found");
      return;
    }

    console.log("💳 Saving payment method:", paymentMethodId);

    // Save payment method directly to Sanity (webhook context, no auth)
    await savePaymentMethodDirectly(session.metadata.userId, paymentMethodId);

    console.log("✅ Payment method saved successfully");
  } catch (error) {
    // Don't fail the entire order if payment method saving fails
    console.error("⚠️  Failed to save payment method:", error);
  }
}

/**
 * Helper: Save payment method directly to Sanity (bypass auth requirement)
 */
async function savePaymentMethodDirectly(
  clerkUserId: string,
  paymentMethodId: string
) {
  // Retrieve payment method details from Stripe
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

  if (paymentMethod.type !== "card") {
    throw new Error("Only card payment methods are supported");
  }

  // Get user document
  const user = await client.fetch(
    `*[_type == "user" && clerkUserId == $clerkUserId][0]{
      _id,
      paymentMethods
    }`,
    { clerkUserId }
  );

  if (!user) {
    throw new Error("User not found");
  }

  // Check if payment method already exists
  const methodExists = user.paymentMethods?.some(
    (pm: { stripePaymentMethodId: string }) =>
      pm.stripePaymentMethodId === paymentMethodId
  );

  if (methodExists) {
    console.log("ℹ️  Payment method already saved");
    return;
  }

  // Check if this is the first payment method (make it default)
  const isFirstMethod =
    !user.paymentMethods || user.paymentMethods.length === 0;

  // Prepare payment method data
  const paymentMethodData = {
    stripePaymentMethodId: paymentMethod.id,
    type: paymentMethod.type,
    last4: paymentMethod.card?.last4 || "",
    brand: paymentMethod.card?.brand || "",
    expMonth: paymentMethod.card?.exp_month || 0,
    expYear: paymentMethod.card?.exp_year || 0,
    isDefault: isFirstMethod,
    addedAt: new Date().toISOString(),
  };

  // Save to Sanity
  await backendClient
    .patch(user._id)
    .setIfMissing({ paymentMethods: [] })
    .append("paymentMethods", [paymentMethodData])
    .set({ "metadata.updatedAt": new Date().toISOString() })
    .commit();
}
