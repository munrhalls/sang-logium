import { getMarketingItem } from "@/sanity/lib/marketing/getMarketingItem";
import HeroCarousel from "./homepage/components/heroCarousel/heroCarousel";

export default async function Page() {
  const marketingItem = await getMarketingItem("Homepage Hero Carousel");

  const heroSlides = marketingItem?.slides;

  console.log(heroSlides, "heroSlides");

  return (
    <div
      style={{
        height: `calc(100vh - var(--header-height) - var(--categories-nav-height) - var(--footer-height))`,
      }}
      className="grid grid-cols-4 grid-rows-1 bg-blue-300"
    >
      <div className="col-span-4 col-start-1 bg-slate-300">
        {heroSlides && <HeroCarousel slides={heroSlides} />}
      </div>
    </div>
  );
}
