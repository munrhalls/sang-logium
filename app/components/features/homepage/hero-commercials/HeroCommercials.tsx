import { getCommercialsHeroSecondary } from "@/sanity/lib/commercials/getCommercialsHeroMain";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";
import CarouselSingleSlide from "../../../ui/carousel-single-slide/carouselSingleSlide";
import HeroCommercialItem from "./HeroCommercialItem";
import HeroSkeleton from "./HeroSkeleton";
import { Suspense } from "react";

export default async function HeroCommercials() {
  try {
    const heroCommercials = await getCommercialsHeroSecondary();

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
      <Suspense fallback={<HeroSkeleton />}>
        <CarouselSingleSlide prebuiltSlides={prebuiltCommercials} keys={keys} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error loading hero commercials:", error);
    return <HeroSkeleton />;
  }
}
