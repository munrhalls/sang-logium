import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";

export async function POST(req: Request) {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      (await headers()).get("stripe-signature")!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.log(err);
    console.log(`❌ Webhook Error: ${errorMessage}`);
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  const permittedEvents = ["checkout.session.completed"];

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case "checkout.session.completed":
          data = event.data.object;
          console.log(`✅ Payment completed! Session: ${data.id}`);
          console.log(`📧 Customer: ${data.customer_details?.email}`);
          console.log(`💰 Amount: $${(data.amount_total || 0) / 100}`);

          // Fetch full session with line items
          const session = await stripe.checkout.sessions.retrieve(data.id, {
            expand: ["line_items", "line_items.data.price.product"],
          });

          const shippingAddress = session.shipping_details?.address;

          const shippingAddress = {
            shippingAddress: {
              line1: shippingAddress?.line1,
              line2: shippingAddress?.line2,
              city: shippingAddress?.city,
              state: shippingAddress?.state,
              postalCode: shippingAddress?.postal_code,
              country: shippingAddress?.country,
            },
            shippingName: session.shipping_details?.name,
          };

          // Verify amount matches line items (security check)
          const calculatedTotal =
            session.line_items?.data.reduce(
              (sum, item) => sum + item.amount_total,
              0
            ) || 0;

          if (calculatedTotal !== session.amount_total) {
            console.error(
              `❌ Amount mismatch! Calculated: ${calculatedTotal}, Session: ${session.amount_total}`
            );
            throw new Error("Amount verification failed");
          }

          console.log(`✅ Amount verified: $${calculatedTotal / 100}`);

          // Check if order already exists (idempotency)
          //TODO Coded before orders existed, check later
          const existingOrder = await backendClient.fetch(
            `*[_type == "order" && stripeSessionId == $sessionId][0]`,
            { sessionId: data.id }
          );

          if (existingOrder) {
            console.log(
              `⚠️ Order already exists: ${existingOrder.orderNumber}`
            );
            break; // Skip duplicate creation
          }

          // Create order in Sanity
          const orderNumber = `ORD-${Date.now()}`;
          await backendClient.create({
            _type: "order",
            orderNumber,
            orderId: data.id,
            stripeSessionId: data.id,
            customerEmail: session.customer_details?.email || "unknown",
            isGuest: !session.metadata?.userId,
            clerkUserId: session.metadata?.userId || null,
            orderStatus: "pending",
            shippingAddress: shippingAddress,
            items:
              session.line_items?.data.map((item) => ({
                _type: "orderItem",
                productId:
                  typeof item.price?.product === "object"
                    ? item.price.product.id
                    : item.price?.product,
                name:
                  typeof item.price?.product === "object"
                    ? item.price.product.name
                    : "Product",
                quantity: item.quantity || 1,
                priceAtPurchase: (item.price?.unit_amount || 0) / 100,
                totalPrice: item.amount_total / 100,
              })) || [],
            totalAmount: (session.amount_total || 0) / 100,
            currency: session.currency || "usd",
          });

          console.log(`📦 Order created: ${orderNumber}`);
          break;
        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Webhook handler failed" },
        { status: 500 }
      );
    }
  }
  return NextResponse.json({ message: "Received" }, { status: 200 });
}
