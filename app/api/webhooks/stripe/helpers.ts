import { stripe } from "@/lib/stripe";
import { client } from "@/sanity/lib/client";
import Stripe from "stripe";

/**
 * STEP 8: Fetch line items from Stripe session
 * The session object doesn't include line items, so we need to fetch them
 */
export async function fetchStripeLineItems(sessionId: string) {
  console.log("📦 Fetching line items for session:", sessionId);

  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
    expand: ["data.price.product"], // Get full product details
  });

  console.log(`✅ Found ${lineItems.data.length} line items`);
  return lineItems.data;
}

/**
 * STEP 9: Fetch product details from Sanity using Stripe price IDs
 */
interface SanityProduct {
  _id: string;
  name: string;
  stripePriceId: string;
  displayPrice?: number;
  price?: number;
  image?: unknown;
  slug?: { current: string };
  stock?: number;
}

export async function fetchProductsByPriceIds(
  priceIds: string[]
): Promise<SanityProduct[]> {
  console.log("🔍 Fetching products from Sanity for price IDs:", priceIds);

  const query = `
    *[_type == "product" && stripePriceId in $priceIds] {
      _id,
      name,
      stripePriceId,
      displayPrice,
      price,
      image,
      slug,
      stock
    }
  `;

  const products = await client.fetch(query, { priceIds });

  console.log(`✅ Found ${products.length} products in Sanity`);
  return products;
}

/**
 * STEP 10: Map Stripe line items to order items
 */
export interface OrderItem {
  productId: string;
  productRef: string;
  name: string;
  stripePriceId: string;
  price: number;
  quantity: number;
  subtotal: number;
  imageUrl?: string;
  slug?: string;
}

export async function mapLineItemsToOrderItems(
  lineItems: Stripe.LineItem[]
): Promise<OrderItem[]> {
  // Extract price IDs
  const priceIds = lineItems
    .map((item) => item.price?.id)
    .filter(Boolean) as string[];

  // Fetch product data from Sanity
  const products = await fetchProductsByPriceIds(priceIds);

  // Create lookup map
  const productMap = new Map(products.map((p) => [p.stripePriceId, p]));

  // Map line items to order items
  const orderItems: OrderItem[] = [];

  for (const lineItem of lineItems) {
    if (!lineItem.price) {
      console.warn("⚠️ Line item missing price:", lineItem);
      continue;
    }

    const product = productMap.get(lineItem.price.id);

    if (!product) {
      console.error(`❌ Product not found for price ID: ${lineItem.price.id}`);
      throw new Error(
        `Product not found in database for price: ${lineItem.price.id}`
      );
    }

    const priceInDollars = (lineItem.price.unit_amount || 0) / 100;
    const quantity = lineItem.quantity || 1;

    orderItems.push({
      productId: product._id,
      productRef: product._id,
      name: product.name,
      stripePriceId: product.stripePriceId,
      price: priceInDollars,
      quantity: quantity,
      subtotal: priceInDollars * quantity,
      slug: product.slug?.current,
      // imageUrl: We'll handle image URL transformation later
    });
  }

  console.log(`✅ Mapped ${orderItems.length} order items`);
  return orderItems;
}
