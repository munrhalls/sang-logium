import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.CHECKOUT_JWT_SECRET || "dev-secret-key"
);

export interface GuestContext {
  address?: {
    line1: string;
    line2: string;
    city: string;
    postal_code: string;
    country: string;
  };
}

export async function getCheckoutCookie(): Promise<GuestContext | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("checkout_context")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as GuestContext;
  } catch (error) {
    console.error("Invalid checkout cookie:", error);
    return null;
  }
}
