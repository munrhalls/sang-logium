import { cookies } from "next/headers";

export async function getCheckoutCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get("checkout_context");

  if (!token?.value) {
    return null;
  }

  try {
    return JSON.parse(token.value);
  } catch {
    return null;
  }
}
