import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    // Parse the publicBasket from request body
    const { publicBasket } = await req.json();

    if (!publicBasket || !Array.isArray(publicBasket)) {
      return NextResponse.json(
        { error: "Invalid basket data" },
        { status: 400 }
      );
    }

    // Get the origin for the return URL
    const origin = req.headers.get("origin") || req.nextUrl.origin;

    // Map basket items to Stripe line items
    const lineItems = publicBasket.map(
      (item: { stripePriceId: string; quantity: number }) => ({
        price: item.stripePriceId,
        quantity: item.quantity,
      })
    );

    // Create Stripe Checkout Session with embedded UI mode
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: lineItems,
      mode: "payment",
      return_url: `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    // Return only the client_secret
    return NextResponse.json({ client_secret: session.client_secret });
  } catch (error) {
    console.error("Checkout session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
