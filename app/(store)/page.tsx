// import { getAllHeroSales } from "@/sanity/lib/sales/getAllHeroSales";
import HeroCarousel from "./homepage/components/heroCarousel/heroCarousel";

// Define a new type with only the necessary properties

export default async function Page() {
  // const heroSales = await getAllHeroSales();

  return (
    <div
      style={{
        height: `calc(100vh - var(--header-height) - var(--categories-nav-height) - var(--footer-height))`,
      }}
      className="grid grid-cols-4 grid-rows-1 bg-blue-300"
    >
      <div className="col-span-4 col-start-1 bg-slate-300">
        {/* <HeroCarousel sales={heroSales} /> */}
      </div>
    </div>
  );
}
