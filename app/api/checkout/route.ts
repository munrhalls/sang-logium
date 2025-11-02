import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { publicBasket } = await req.json();
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!publicBasket || !Array.isArray(publicBasket)) {
      return NextResponse.json(
        { error: "Invalid basket data" },
        { status: 400 }
      );
    }

    const origin = req.headers.get("origin") || req.nextUrl.origin;

    const lineItems = publicBasket.map(
      (item: { stripePriceId: string; quantity: number }) => ({
        price: item.stripePriceId,
        quantity: item.quantity,
      })
    );

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
