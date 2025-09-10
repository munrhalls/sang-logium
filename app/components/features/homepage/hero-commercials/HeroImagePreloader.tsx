import { heroImageUrl } from "@/lib/imageUrl";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";

export default function HeroImagePreloader({
  heroCommercials
}: {
  heroCommercials: GET_COMMERCIALS_BY_FEATURE_QUERYResult
}) {
  try {
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
