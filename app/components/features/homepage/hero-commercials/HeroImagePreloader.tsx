import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
import { heroImageUrl } from "@/lib/imageUrl";

export default async function HeroImagePreloader() {
  try {
    const heroCommercials = await getCommercialsByFeature("hero");
    const firstCommercial = heroCommercials[0];

    if (!firstCommercial?.image) return null;

    const preloadUrl = heroImageUrl(firstCommercial.image).url();

    return (
      <link
        rel="preload"
        as="image"
        href={preloadUrl}
        type="image/webp"
        fetchPriority="high"
      />
    );
  } catch (error) {
    console.error("Error preloading hero image:", error);
    return null;
  }
}
