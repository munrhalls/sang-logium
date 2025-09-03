import { getCommercialsHero } from "@/sanity/lib/commercials/getCommercialsHero";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";
import CarouselSingleSlide from "../../../ui/carousel-single-slide/carouselSingleSlide";
import HeroCommercialItem from "./HeroCommercialItem";
import HeroFallback from "./HeroFallback";

const HERO_FEATURE = "hero" as const;

export default async function HeroCommercials() {
  try {
    const heroCommercials = await getCommercialsHero(HERO_FEATURE);

    const prebuiltCommercials = heroCommercials.map(
      (
        commercial: GET_COMMERCIALS_BY_FEATURE_QUERYResult[number],
        index: number
      ) => (
        <HeroCommercialItem
          key={commercial._id}
          commercial={commercial}
          index={index}
        />
      )
    );

    const keys = heroCommercials.map(
      (commercial: GET_COMMERCIALS_BY_FEATURE_QUERYResult[number]) =>
        commercial._id
    );

    return (
      <CarouselSingleSlide prebuiltSlides={prebuiltCommercials} keys={keys} />
    );
  } catch (error) {
    console.error("Error loading hero commercials:", error);
    return <HeroFallback />;
  }
}
