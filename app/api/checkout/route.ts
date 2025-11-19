import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";
import type { Product } from "@/types/product";

export async function POST(req: NextRequest) {
  try {
    const { publicBasket } = await req.json();
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

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

    const serverProducts: Array<{
      _id: string;
      name: string;
      price: number;
      stock: number;
      stripePriceId: string;
      _rev: string;
    }> = await backendClient.fetch(
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
    // if stock is 0, then what?
    // if stock 1 and potentially two requests come in at the same time, then what? (that should be impossible btw)
    // TODO frontend - restrict edge case where user adds more items to basket than available in stock
    // TODO frontend - handle edge case where two users try to checkout their basket but have the same last item at the same time (the first request should go through, the second should get an out-of-stock error)
    // TODO backend - double check stock here before creating the session
    // TODO handle AFTER checkout - if session expired, rollback stock SAFELY (that is don't set stock count, simply increment by the amount previously decremented)

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

      if (serverProduct.stock <= 0) {
        return NextResponse.json(
          { error: `Sorry, ${serverProduct.name} is out of stock.` },
          { status: 409 }
        );
      }

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
        // inventory_lock: publicBasket
        //   .map((i: any) => `${i._id}:${i.quantity}`)
        //   .join(","),
        // TODO save stock info for rollback later if session expired or payment failed
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

// webhook handler for expired sessions
export async function handleExpiredSession(req: NextRequest) {
  const { session_id } = await req.json();

  // TODO: Rollback stock using session metadata
}

// webhook handler for failed payments
export async function handleFailedPayment(req: NextRequest) {
  const { session_id } = await req.json();
}
