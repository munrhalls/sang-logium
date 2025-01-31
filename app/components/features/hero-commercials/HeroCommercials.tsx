import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
import Carousel from "../../ui/carousel/carousel";
import Slide from "../../ui/carousel/slide";
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

  const prebuiltSlides = prebuiltCommercials.map(
    (prebuiltCommercial, index) => (
      <Slide key={keys[index] + "_Slide"} prebuiltItem={prebuiltCommercial} />
    )
  );

  return <Carousel prebuiltSlides={prebuiltSlides} keys={keys} />;
}
