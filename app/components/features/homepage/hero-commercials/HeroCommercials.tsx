import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";
import CarouselSingleSlide from "../../../ui/carousel-single-slide/carouselSingleSlide";
import HeroCommercialItem from "./HeroCommercialItem";
import HeroPerformanceMonitor from "./HeroPerformanceMonitor";
import HeroFallback from "./HeroFallback";

const HERO_FEATURE = "hero" as const;

export default async function HeroCommercials() {
  try {
    const heroCommercials = await getCommercialsByFeature(HERO_FEATURE);

    if (!heroCommercials || heroCommercials.length === 0) {
      return <HeroFallback />;
    }

    const sortedCommercials = heroCommercials
      .sort(
        (
          a: GET_COMMERCIALS_BY_FEATURE_QUERYResult[number],
          b: GET_COMMERCIALS_BY_FEATURE_QUERYResult[number]
        ) => (a?.displayOrder ?? 0) - (b?.displayOrder ?? 0)
      )
      .filter(
        (commercial: GET_COMMERCIALS_BY_FEATURE_QUERYResult[number]) =>
          commercial?.image
      );

    const prebuiltCommercials = sortedCommercials.map(
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

    const keys = sortedCommercials.map(
      (commercial: GET_COMMERCIALS_BY_FEATURE_QUERYResult[number]) =>
        commercial._id
    );

    return (
      <>
        <HeroPerformanceMonitor />
        <CarouselSingleSlide prebuiltSlides={prebuiltCommercials} keys={keys} />
      </>
    );
  } catch (error) {
    console.error("Error loading hero commercials:", error);
    return <HeroFallback />;
  }
}
