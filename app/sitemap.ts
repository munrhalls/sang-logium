import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

const SITE_URL = "https://sang-logium.com";

// Strongly-typed Sanity document shape used by this sitemap generator
interface SanityDocument {
  slug: string;
  _updatedAt?: string;
}

// Allowed changefreq values used by sitemaps
type ChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

// Extend Next's sitemap entry element to allow optional changeFrequency/priority
type SitemapEntry = MetadataRoute.Sitemap[number] & {
  changeFrequency?: ChangeFreq;
  priority?: number;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // 1. Fetch Products AND Categories in parallel for speed
    const [products, categories] = await Promise.all<
      [SanityDocument[], SanityDocument[]]
    >([
      client.fetch(
        `*[_type == "product" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`
      ),
      client.fetch(
        `*[_type == "category" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`
      ),
    ]);

    // 2. Map Products
    const productUrls = (products || []).map((p: any) => {
      const safeSlug = encodeURIComponent(p.slug);

      return {
        url: `${SITE_URL}/product/${safeSlug}`,
        lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      };
    });

    // 3. Map Categories
    const categoryUrls = (categories || []).map((c: any) => {
      const safeSlug = encodeURIComponent(c.slug);

      return {
        url: `${SITE_URL}/category/${safeSlug}`,
        lastModified: c._updatedAt ? new Date(c._updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });

    // 4. Define Static Pages (The "Skeleton" of your app)
    const staticRoutes: SitemapEntry[] = [
      "", // Homepage
      "/basket", // Cart Page
      "/checkout", // Checkout Page
      "/search", // Search Page
      // "/about",  // Uncomment if you have these
      // "/contact",
    ].map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency:
        route === "" ? ("daily" as ChangeFreq) : ("monthly" as ChangeFreq),
      priority: route === "" ? 1.0 : 0.5,
    }));

    // Return as MetadataRoute.Sitemap — SitemapEntry is compatible with the expected shape.
    return [
      ...staticRoutes,
      ...productUrls,
      ...categoryUrls,
    ] as MetadataRoute.Sitemap;
  } catch (err) {
    console.error("Sitemap generation failed:", err);
    return [{ url: SITE_URL, lastModified: new Date() }];
  }
}
