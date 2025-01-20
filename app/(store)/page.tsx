import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
import Header from "@/components/ui/Header";
import DesktopCategoriesNav from "@/components/ui/desktop/DesktopCategoriesNav";
import MobileComponents from "@/components/ui/mobile/MobileComponents";
import Carousel from "@/components/ui/carousel/carousel";
import Slide from "@/components/ui/carousel/staticSlide";

export default async function Page() {
  const heroCommercials = await getCommercialsByFeature("hero");
  const categories = await getAllCategories();

  const prebuiltSlides = heroCommercials.map((commercial, index) => (
    <Slide key={commercial._id} commercial={commercial} index={index} />
  ));
  const heroCommercialsKeys = heroCommercials.map(
    (commercial) => commercial._id
  );

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
            <Carousel
              prebuiltSlides={prebuiltSlides}
              keys={heroCommercialsKeys}
            />
          </div>
        </div>
        <MobileComponents categories={categories} />
      </main>
    </div>
  );
}
