import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
  console.log("🔥 Sanity Webhook received! Revalidating...");
  revalidateTag("catalogue-index");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
