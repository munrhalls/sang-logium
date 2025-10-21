import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { client } from "@/sanity/lib/client";
import { backendClient } from "@/sanity/lib/backendClient";
import { fetchStripeLineItems, mapLineItemsToOrderItems } from "./helpers";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  console.log("🔔 Webhook received");
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");
    if (!signature) {
      console.error("❌ No signature found");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }
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
    console.log(`📨 Event type: ${event.type}`);
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case "payment_intent.succeeded":
        console.log(
          "💰 Payment succeeded (already handled in checkout.session.completed)"
        );
        break;
      default:
        console.log(`🤷 Unhandled event type: ${event.type}`);
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("💥 Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed", details: String(error) },
      { status: 200 }
    );
  }
}
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  console.log("🛒 Processing checkout session:", session.id);
  console.log("Customer email:", session.customer_email);
  console.log("Amount:", session.amount_total);
  console.log("User ID:", session.metadata?.userId);

  try {
    const existingOrder = await client.fetch(
      `*[_type == "order" && payment.stripeCheckoutSessionId == $sessionId][0]._id`,
      { sessionId: session.id }
    );
    if (existingOrder) {
      console.log("✅ Order already exists for this session:", existingOrder);
      return;
    }
    const lineItems = await fetchStripeLineItems(session.id);
    if (!lineItems || lineItems.length === 0) {
      throw new Error("No line items found in session");
    }
    const orderItems = await mapLineItemsToOrderItems(lineItems);
    if (!orderItems || orderItems.length === 0) {
      throw new Error("Failed to map line items to order items");
    }
    const now = new Date().toISOString();
    const orderNumber = await generateOrderNumber();
    const orderData = {
      _type: "order",
      orderNumber,
      orderId: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      clerkUserId: session.metadata?.userId,
      customerEmail: session.customer_email,
      isGuest: !session.metadata?.userId,
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
      pricing: {
        subtotal: (session.amount_subtotal || 0) / 100,
        shipping: 0,
        tax: (session.total_details?.amount_tax || 0) / 100,
        total: (session.amount_total || 0) / 100,
        currency: session.currency?.toUpperCase() || "USD",
      },
      status: "processing",
      dates: {
        orderedAt: now,
        paidAt: now,
      },
      payment: {
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
        method: "card",
      },
      metadata: {
        source: "web",
      },
    };
    console.log("💾 Creating order in Sanity...");
    const createdOrder = await backendClient.create(orderData);
    console.log("✅ Order created:", createdOrder._id, orderNumber);
    console.log("📉 Decrementing stock...");
    for (const item of orderItems) {
      await backendClient
        .patch(item.productId)
        .dec({ stock: item.quantity })
        .commit();
      console.log(`  ✓ Decremented stock for ${item.name} by ${item.quantity}`);
    }
    await savePaymentMethodIfRequested(session);
    console.log("🎉 Order processing complete!");
  } catch (error) {
    console.error("💥 Error processing order:", error);
    throw error;
  }
}

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
async function savePaymentMethodIfRequested(session: Stripe.Checkout.Session) {
  try {
    if (!session.metadata?.userId) {
      console.log("⏭️  Guest checkout - skipping payment method save");
      return;
    }
    const paymentIntentId = session.payment_intent as string;
    if (!paymentIntentId) {
      console.log("⚠️  No payment intent found");
      return;
    }
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
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

    const stripeCustomerId = session.customer as string;
    await savePaymentMethodDirectly(
      session.metadata.userId,
      paymentMethodId,
      stripeCustomerId
    );
    console.log("✅ Payment method saved successfully");
  } catch (error) {
    console.error("⚠️  Failed to save payment method:", error);
  }
}
async function savePaymentMethodDirectly(
  clerkUserId: string,
  paymentMethodId: string,
  stripeCustomerId: string
) {
  // 1. Fetch Payment Method details and validate type
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
  if (paymentMethod.type !== "card") {
    throw new Error("Only card payment methods are supported");
  }

  // 2. Fetch User document from Sanity
  // NOTE: You must include 'stripeCustomerId' in the GROQ projection
  // to check if it exists in the user object.
  const user = await client.fetch(
    `*[_type == "user" && clerkUserId == $clerkUserId][0]{
      _id,
      paymentMethods,
      stripeCustomerId // 👈 MUST BE ADDED TO PROJECTION
    }`,
    { clerkUserId }
  );
  if (!user) {
    throw new Error("User not found");
  }

  // 3. Start building the patch
  const patches = backendClient.patch(user._id);

  // 4. CRITICAL FIX: Conditionally set Stripe Customer ID
  // This ensures the Customer ID is saved only once.
  if (!user.stripeCustomerId) {
    patches.set({ stripeCustomerId: stripeCustomerId });
    console.log("💳 Saved new Stripe Customer ID to user.");
  }

  // 5. Check if Payment Method already exists
  const methodExists = user.paymentMethods?.some(
    (pm: { stripePaymentMethodId: string }) =>
      pm.stripePaymentMethodId === paymentMethodId
  );
  if (methodExists) {
    console.log("ℹ️  Payment method already saved, no append needed.");
    // If only the payment method exists, but the customer ID was missing
    // and was set above, we still need to commit the customer ID patch.
  } else {
    // 6. Define new Payment Method data
    const isFirstMethod =
      !user.paymentMethods || user.paymentMethods.length === 0;
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

    // 7. Add patch for Payment Method
    patches
      .setIfMissing({ paymentMethods: [] })
      .append("paymentMethods", [paymentMethodData]);

    console.log("✅ New payment method data added to patch.");
  }

  // 8. Add final metadata update
  patches.set({ "metadata.updatedAt": new Date().toISOString() });

  // 9. FINAL STEP: Commit ALL changes at once
  await patches.commit(); // 👈 ONLY ONE COMMIT IS REQUIRED
}
