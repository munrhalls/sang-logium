// import { NextResponse } from "next/server";
// import { headers } from "next/headers";
// import { stripe } from "@/lib/stripe/stripe";
// import { backendClient } from "@/sanity/lib/backendClient";
// import Stripe from "stripe";

// export async function POST(req: Request) {
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       await req.text(),
//       (await headers()).get("stripe-signature")!,
//       process.env.STRIPE_WEBHOOK_SECRET!
//     );
//   } catch (err: unknown) {
//     const errorMessage = err instanceof Error ? err.message : "Unknown error";
//     console.log(err);
//     console.log(`❌ Webhook Error: ${errorMessage}`);
//     return NextResponse.json(
//       { message: `Webhook Error: ${errorMessage}` },
//       { status: 400 }
//     );
//   }

//   const permittedEvents = ["checkout.session.completed"];

//   console.log(
//     "???????????????????????????????????????????????? CHECKOUT WEBHOOK"
//   );
//   if (permittedEvents.includes(event.type)) {
//     let data;

//     try {
//       switch (event.type) {
//         case "checkout.session.completed":
//           data = event.data.object;
//           console.log(`✅ Payment completed! Session: ${data.id}`);
//           console.log(`📧 Customer: ${data.customer_details?.email}`);
//           console.log(`💰 Amount: $${(data.amount_total || 0) / 100}`);

//           // Fetch full session with line items
//           const session = (await stripe.checkout.sessions.retrieve(data.id, {
//             expand: ["line_items", "line_items.data.price.product"],
//           })) as Stripe.Checkout.Session;

//           const shippingDetails =
//             session.collected_information?.shipping_details;

//           console.log(shippingDetails, " --- FULL SHIPPING DETAILS");
//           //                     [0] {
//           // [0]   address: {
//           // [0]     city: 'asadsads',
//           // [0]     country: 'PL',
//           // [0]     line1: 'zxczxasdas',
//           // [0]     line2: null,
//           // [0]     postal_code: 'asdadsdas',
//           // [0]     state: null
//           // [0]   },

//           // [0]   name: 'asdasdads'
//           const shippingData = shippingDetails;

//           // Verify amount matches line items (security check)
//           const calculatedTotal =
//             session.line_items?.data.reduce(
//               (sum, item) => sum + item.amount_total,
//               0
//             ) || 0;

//           if (calculatedTotal !== session.amount_total) {
//             console.error(
//               `❌ Amount mismatch! Calculated: ${calculatedTotal}, Session: ${session.amount_total}`
//             );
//             throw new Error("Amount verification failed");
//           }

//           console.log(`✅ Amount verified: $${calculatedTotal / 100}`);

//           // Check if order already exists (idempotency)
//           //TODO Coded before orders existed, check later
//           const existingOrder = await backendClient.fetch(
//             `*[_type == "order" && stripeSessionId == $sessionId][0]`,
//             { sessionId: data.id }
//           );

//           if (existingOrder) {
//             console.log(
//               `⚠️ Order already exists: ${existingOrder.orderNumber}`
//             );
//             break; // Skip duplicate creation
//           }

//           // Create order in Sanity
//           const orderNumber = `ORD-${Date.now()}`;
//           await backendClient.create({
//             _type: "order",
//             orderNumber,
//             orderId: data.id,
//             stripeSessionId: data.id,
//             customerEmail: session.customer_details?.email || "unknown",
//             isGuest: !session.metadata?.userId,
//             clerkUserId: session.metadata?.userId || null,
//             orderStatus: "pending",
//             shippingAddress: shippingAddressOrder,
//             items:
//               session.line_items?.data.map((item) => ({
//                 _type: "orderItem",
//                 productId:
//                   typeof item.price?.product === "object"
//                     ? item.price.product.id
//                     : item.price?.product,
//                 name:
//                   typeof item.price?.product === "object"
//                     ? item.price.product.name
//                     : "Product",
//                 quantity: item.quantity || 1,
//                 priceAtPurchase: (item.price?.unit_amount || 0) / 100,
//                 totalPrice: item.amount_total / 100,
//               })) || [],
//             totalAmount: (session.amount_total || 0) / 100,
//             currency: session.currency || "usd",
//           });

//           console.log(`📦 Order created: ${orderNumber}`);
//           break;
//         default:
//           throw new Error(`Unhandled event: ${event.type}`);
//       }
//     } catch (error) {
//       console.log(error);
//       return NextResponse.json(
//         { message: "Webhook handler failed" },
//         { status: 500 }
//       );
//     }
//   }
//   return NextResponse.json({ message: "Received" }, { status: 200 });
// }
