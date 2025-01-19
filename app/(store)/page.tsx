import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
import Header from "@/components/ui/Header";
import DesktopCategoriesNav from "@/components/ui/desktop/DesktopCategoriesNav";
import MobileComponents from "@/components/ui/mobile/MobileComponents";
import Carousel from "@/components/ui/carousel/carousel";

export default async function Page() {
  const heroCommercials = await getCommercialsByFeature("hero");
  const categories = await getAllCategories();

  return (
    <div>
      <Header />

      <DesktopCategoriesNav categories={categories} />

      <main className="min-h-full">
        <div
          style={{
            height: `calc(100vh - var(--header-height) - var(--categories-nav-height) - var(--footer-height))`,
          }}
          className="grid grid-cols-4 grid-rows-1 bg-blue-300"
        >
          <div className="col-span-4 col-start-1 bg-slate-300">
            {heroCommercials && <Carousel commercials={heroCommercials} />}
          </div>
        </div>
        <MobileComponents categories={categories} />
      </main>
    </div>
  );
}
