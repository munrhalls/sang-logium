import { getSaleFeaturedProductsByDiscount } from "@/sanity/lib/sales/getSaleFeaturedProductsByDiscount";
import HeroCarousel from "./homepage/components/heroCarousel/heroCarousel";

// Define a new type with only the necessary properties

export default async function Page() {
  const sales10 = await getSaleFeaturedProductsByDiscount(10);
  const sales15 = await getSaleFeaturedProductsByDiscount(15);
  const sales20 = await getSaleFeaturedProductsByDiscount(20);

  return (
    <div
      style={{
        height: `calc(100vh - var(--header-height) - var(--categories-nav-height) - var(--footer-height))`,
      }}
      className="grid grid-cols-4 grid-rows-1 bg-blue-300"
    >
      <div className="col-span-4 col-start-1 bg-slate-300">
        <HeroCarousel sales={sales} />
      </div>
    </div>
  );
}
