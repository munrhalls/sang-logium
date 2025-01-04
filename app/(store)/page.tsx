import { getcommercial } from "@/sanity/lib/commercials/getCommercialsBySection";
import HeroCarousel from "../../components/sections/heroCarousel/heroCarousel";
import { commercial } from "@/sanity.types";

export default async function Page() {
  const commercial: commercial = await getcommercial("Homepage Hero Carousel");

  const heroSlides = commercial?.slides;

  console.log(heroSlides, "heroSlides");

  return (
    <div
      style={{
        height: `calc(100vh - var(--header-height) - var(--categories-nav-height) - var(--footer-height))`,
      }}
      className="grid grid-cols-4 grid-rows-1 bg-blue-300"
    >
      <div className="col-span-4 col-start-1 bg-slate-300">
        {heroSlides?.length && <HeroCarousel slides={heroSlides} />}
      </div>
    </div>
  );
}
