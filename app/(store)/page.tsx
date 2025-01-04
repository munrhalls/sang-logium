import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
import HeroCarousel from "../../components/features/heroCarousel/heroCarousel";
import { Commercial } from "@/sanity.types";
import BaseCarousel from "@/components/ui/baseCarousel";
export default async function Page() {
  const commercials: Commercial[] = await getCommercialsByFeature("hero");

  console.log(commercials, "commercials");

  return (
    <div
      style={{
        height: `calc(100vh - var(--header-height) - var(--categories-nav-height) - var(--footer-height))`,
      }}
      className="grid grid-cols-4 grid-rows-1 bg-blue-300"
    >
      <div className="col-span-4 col-start-1 bg-slate-300">
        {/* {heroSlides?.length && <HeroCarousel slides={heroSlides} />} */}
        {commercials?.length && <BaseCarousel />}
      </div>
    </div>
  );
}
