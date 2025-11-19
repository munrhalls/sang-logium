import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";
import type {
  ServerProduct,
  PublicBasketItem,
} from "@/app/(store)/checkout/checkout.types";

export async function POST(req: NextRequest) {
  try {
    const { publicBasket }: { publicBasket: PublicBasketItem[] } =
      await req.json();
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    // TODO check What about shipping data? Not needed in the payment?
    // TODO decrement sanity stock intantly in order to prevent race conditions
    // TODO only after failed payment / unsuccessful checkout - perform stock check and rollback safely (another customer might have bought in the meantime)
    // TODO validate publicBasket structure more thoroughly
    // TODO type it properly
    // TODO after checkout session is completed, send order data to sanity and only then decrement stock
    if (
      !publicBasket ||
      !Array.isArray(publicBasket) ||
      publicBasket.length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid basket data" },
        { status: 400 }
      );
    }

    const productIds = publicBasket.map((item) => item._id);

    // STOCK RESERVATION SYSTEM:
    // Available Stock = stock - reservedStock
    // 1. Fetch products with: stock, reservedStock, _rev
    // 2. Check: (stock - reservedStock) >= requestedQuantity
    // 3. If YES: Atomically increment reservedStock using _rev
    // 4. If NO: Return error "Item being purchased by another user"
    // 5. On payment success: Decrement both stock AND reservedStock
    // 6. On payment failure/expiry: Only decrement reservedStock after 15-30min timeout
    // 7. Race condition handled by _rev - first transaction wins, second fails
    const serverProducts: ServerProduct[] = await backendClient.fetch(
      `*[_type == "product" && _id in $productIds] {
        _id,
        name,
        price,
        stock,
        stripePriceId,
        _rev,
      }`,
      { productIds }
    );

    const origin = req.headers.get("origin") || req.nextUrl.origin;

    // STOCK VALIDATION LOGIC:
    // TODO: Add reservedStock field to Product schema in Sanity
    // TODO: Fetch reservedStock along with stock in the query above
    // TODO: Calculate availableStock = stock - reservedStock
    // TODO: Check if availableStock >= clientItem.quantity (not just stock)
    // TODO: If availableStock < quantity but stock >= quantity: Return 409 "Item being purchased"
    // TODO: Use transaction to atomically: increment reservedStock + check _rev
    // TODO: Frontend should display: stock - reservedStock as "Available Now"
    const lineItems: Array<{ price: string; quantity: number }> = [];
    const sanityTransaction = backendClient.transaction();

    for (const clientItem of publicBasket) {
      const serverProduct = serverProducts.find(
        (p) => p._id === clientItem._id
      );

      if (!serverProduct) {
        return NextResponse.json(
          { error: `Product with ID ${clientItem._id} no longer exists.` },
          { status: 400 }
        );
      }

      // TODO: Replace with: availableStock = serverProduct.stock - serverProduct.reservedStock
      // TODO: Check availableStock <= 0 instead of stock <= 0
      if (serverProduct.stock <= 0) {
        return NextResponse.json(
          { error: `Sorry, ${serverProduct.name} is out of stock.` },
          { status: 409 }
        );
      }

      // TODO: Replace with: availableStock < clientItem.quantity
      // TODO: Add additional check: if (stock >= quantity but availableStock < quantity)
      //       Return: "Item currently being purchased by another customer. Please try again shortly."
      if (serverProduct.stock < clientItem.quantity) {
        return NextResponse.json(
          {
            error: `Sorry, ${serverProduct.name} is out of stock. Available: ${serverProduct.stock}`,
          },
          { status: 409 }
        );
      }

      lineItems.push({
        price: serverProduct.stripePriceId,
        quantity: clientItem.quantity,
      });

      // CURRENT: Decrementing stock immediately (causes race conditions)
      // TODO: Change to increment reservedStock instead: p.inc({ reservedStock: clientItem.quantity })
      // TODO: Keep stock unchanged at this stage (only reserve, don't decrement)
      // TODO: Stock will be decremented later in webhook on successful payment
      sanityTransaction.patch(serverProduct._id, (p) =>
        p.dec({ stock: clientItem.quantity }).ifRevisionId(serverProduct._rev)
      );
    }

    await sanityTransaction.commit();

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: lineItems,
      mode: "payment",
      return_url: `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      ...(userEmail && {
        customer_email: userEmail,
        customer_creation: "always",
      }),
      metadata: {
        productsIntent: publicBasket
          .map((item: PublicBasketItem) => `${item._id}:${item.quantity}`)
          .join(","),
        clerkUserId: user?.id || "guest",
      },
      expires_at: Math.floor(Date.now() / 1000) + 25 * 60,
    });

    return NextResponse.json({ client_secret: session.client_secret });
  } catch (error) {
    console.error("Checkout session creation error:", error);
    // TODO: Technically, if Stripe creation fails here but Sanity succeeded,
    // we have a phantom decrement. In a perfect world, we would rollback Sanity here.
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

// WEBHOOK HANDLER: Expired Sessions
// TODO: Listen for 'checkout.session.expired' event
// TODO: Parse metadata.productsIntent to get productId:quantity pairs
// TODO: Wait 15-30 minutes before rollback (grace period for user to retry)
// TODO: Decrement reservedStock for each product (release reservation)
// TODO: Do NOT touch stock field (it was never decremented from total inventory)
// TODO: Use inc() not set() to safely handle concurrent operations
export async function handleExpiredSession(req: NextRequest) {
  const { session_id } = await req.json();

  // TODO: Rollback stock using session metadata
}

// WEBHOOK HANDLER: Failed Payments
// TODO: Listen for 'checkout.session.async_payment_failed' event
// TODO: Parse metadata.productsIntent to get productId:quantity pairs
// TODO: Immediately decrement reservedStock (no grace period needed)
// TODO: Do NOT touch stock field
export async function handleFailedPayment(req: NextRequest) {
  const { session_id } = await req.json();
}
