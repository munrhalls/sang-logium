import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
import Carousel from "@/app/components/ui/carousel/carousel";
import Slide from "@/app/components/ui/carousel/staticSlide";

export default async function Page() {
  const heroCommercials = await getCommercialsByFeature("hero");
  const categories = await getAllCategories();

  // TODO OVERALL TASK: make the prebuiltCategories
  // IMPORTANT - do as minimal of changes as possible, it's only about shifting architecture to prebuild categories

  const prebuiltSlides = heroCommercials.map((commercial, index) => (
    <Slide key={commercial._id} commercial={commercial} index={index} />
  ));
  const heroCommercialsKeys = heroCommercials.map(
    (commercial) => commercial._id
  );

  return (
    <div>
      <main className="min-h-full">
        <div
          style={{
            height: `calc(100vh - var(--header-height) - var(--categories-nav-height) - var(--footer-height))`,
          }}
          className="grid grid-rows-1 "
        >
          <div>
            <Carousel
              prebuiltSlides={prebuiltSlides}
              keys={heroCommercialsKeys}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
