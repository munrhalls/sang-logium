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
    }> = await backendClient.fetch(
      `*[_type == "product" && _id in $productIds] {
        _id,
        name,
        price,
        stock,
        stripePriceId
      }`,
      { productIds }
    );

    const origin = req.headers.get("origin") || req.nextUrl.origin;
    // if stock is 0, then what?
    // if stock 1 and potentially two requests come in at the same time, then what? (that should be impossible btw)
    // TODO frontend - restrict edge case where user adds more items to basket than available in stock
    // TODO frontend - handle edge case where two users try to checkout their basket but have the same last item at the same time (the first request should go through, the second should get an out-of-stock error)
    const lineItems: Array<{ price: string; quantity: number }> = [];

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
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: lineItems,
      mode: "payment",
      return_url: `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      ...(userEmail && {
        customer_email: userEmail,
        customer_creation: "always",
      }),
      shipping_address_collection: {
        allowed_countries: ["PL", "GB"],
      },
    });

    return NextResponse.json({ client_secret: session.client_secret });
  } catch (error) {
    console.error("Checkout session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
