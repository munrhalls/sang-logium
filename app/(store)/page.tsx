import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
import Carousel from "@/app/components/ui/carousel/carousel";
import Slide from "@/app/components/ui/carousel/staticSlide";
import MobileFooter from "@/app/components/ui/footer/MobileFooter";

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
    <main className="min-h-0 overflow-y-auto">
      <div className="bg-indigo-700 h-full grid grid-rows-[1fr_auto]">
        <div className="h-full grid">
          <div className={`/* products container */ z-40 h-full grid gap-3`}>
            <div className="bg-blue-700 h-full grid grid-cols-[33%_2fr]">
              <div className="bg-black h-full w-full "></div>
              <div className="bg-pink-700 h-full w-full "></div>
            </div>
            <div className="bg-blue-700 grid grid-cols-[33%_2fr]">
              <div className="bg-black h-full w-full "></div>
              <div className="bg-pink-700 h-full w-full "></div>
            </div>
            <div className="bg-blue-700 grid grid-cols-[33%_2fr]">
              <div className="bg-black h-full w-full "></div>
              <div className="bg-pink-700 h-full w-full "></div>
            </div>
          </div>
        </div>
        {/* <Carousel prebuiltSlides={prebuiltSlides} keys={heroCommercialsKeys} /> */}
      </div>
      <div className="bg-orange-700 h-full"></div>
      <div className="bg-green-700 h-full"></div>
      <div className="bg-yellow-700 h-full"></div>
    </main>
  );
}
