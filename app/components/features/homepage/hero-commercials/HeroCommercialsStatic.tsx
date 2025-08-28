import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
import CarouselSingleSlide from "../../../ui/carousel-single-slide/carouselSingleSlide";
import HeroCommercialItem from "./HeroCommercialItem";
import HeroPerformanceMonitor from "./HeroPerformanceMonitor";
import HeroFallback from "./HeroFallback";

export async function generateStaticParams() {
  return [{ feature: "hero" }];
}

export default async function HeroCommercialsStatic() {
  try {
    const heroCommercials = await getCommercialsByFeature("hero");

    if (!heroCommercials || heroCommercials.length === 0) {
      return <HeroFallback />;
    }

    const filteredCommercials = heroCommercials.filter((commercial) => commercial?.image);
    
    const keys: string[] = [];
    const prebuiltCommercials = filteredCommercials.map((commercial, index) => {
      keys.push(commercial._id);
      return (
        <HeroCommercialItem
          key={commercial._id + "_HeroCommercialItem"}
          commercial={commercial}
          index={index}
        />
      );
    });



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
