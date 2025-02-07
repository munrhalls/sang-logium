import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
import CarouselSingleSlide from "../../../ui/carousel-single-slide/carouselSingleSlide";
import HeroCommercialItem from "./HeroCommercialItem";

export default async function HeroCommercials() {
  const heroCommercials = await getCommercialsByFeature("hero");

  const keys: string[] = [];

  const prebuiltCommercials = heroCommercials
    .sort((a, b) => (a?.displayOrder ?? 0) - (b?.displayOrder ?? 0))
    .map((commercial, index) => {
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
    <CarouselSingleSlide prebuiltSlides={prebuiltCommercials} keys={keys} />
  );
}
