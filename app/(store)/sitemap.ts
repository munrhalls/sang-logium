import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client"; // ⚠️ Check your specific path

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Fetch all products from Sanity
  // We only need the slug and the last updated date
  const products = await client.fetch(`
    *[_type == "product"] {
      "slug": slug.current,
      _updatedAt
    }
  `);

  // 2. Transform Sanity data into Sitemap format
  const productUrls = products.map((product: any) => ({
    url: `https://sang-logium.com/product/${product.slug}`,
    lastModified: product._updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 3. Return the combined list (Static Pages + Dynamic Products)
  return [
    {
      url: "https://sang-logium.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    // Add other static pages here like '/about' or '/contact' if you have them
    ...productUrls,
  ];
}
