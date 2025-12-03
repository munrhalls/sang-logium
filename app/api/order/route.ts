import { NextRequest, NextResponse } from "next/server";
// import { stripe } from "@/lib/stripe/stripe";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }

  try {
    // Fetch session with line items
    // const session = await stripe.checkout.sessions.retrieve(sessionId, {
    //   expand: ["line_items", "line_items.data.price.product"],
    // });
    // Mock order structure (replace with real DB order later)
    // TODO fix item?.price?.product?.name
    // const order = {
    //   id: sessionId,
    //   status: session.status,
    //   paymentStatus: session.payment_status,
    //   customerEmail: session.customer_details?.email,
    //   amountTotal: session.amount_total ? session.amount_total / 100 : 0,
    //   items:
    //     session.line_items?.data.map((item) => ({
    //       id: item?.id,
    //       name:
    //         typeof item.price?.product === "object"
    //           ? item?.price?.product?.name
    //           : "Product",
    //       quantity: item?.quantity || 1,
    //       price: item?.price?.unit_amount ? item?.price?.unit_amount / 100 : 0,
    //       total: item?.amount_total / 100,
    //     })) || [],
    // };
    // return NextResponse.json(order);
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
