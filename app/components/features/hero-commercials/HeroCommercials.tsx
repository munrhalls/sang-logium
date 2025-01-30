import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
import Carousel from "../../ui/carousel/carousel";
import Slide from "../../ui/carousel/slide";

export default async function HeroCommercials() {
  const heroCommercials = await getCommercialsByFeature("hero");

  const prebuiltSlides = heroCommercials
    .sort((a, b) => (a?.displayOrder ?? 0) - (b?.displayOrder ?? 0))
    .map((commercial, index) => (
      <Slide key={commercial._id} commercial={commercial} index={index} />
    ));

  const heroCommercialsKeys = heroCommercials.map(
    (commercial) => commercial._id
  );

  return (
    <Carousel prebuiltSlides={prebuiltSlides} keys={heroCommercialsKeys} />
  );
}
