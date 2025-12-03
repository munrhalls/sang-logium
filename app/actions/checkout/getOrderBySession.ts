"use server";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  status: string;
  paymentStatus: string;
  customerEmail?: string;
  amountTotal: number;
  items: OrderItem[];
}

export async function getOrderBySession(
  sessionId: string | null
): Promise<Order | null> {
  if (!sessionId) return null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/order?session_id=${sessionId}`,
      { cache: "no-store" }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.error ? null : data;
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return null;
  }
}
