import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
import Carousel from "@/app/components/ui/carousel/carousel";
import Slide from "@/app/components/ui/carousel/staticSlide";

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
    <main className="min-h-0 h-full overflow-y-auto ">
      <div className="h-full grid">
        <Carousel prebuiltSlides={prebuiltSlides} keys={heroCommercialsKeys} />
      </div>
      <div className="grid grid-rows-1 h-full bg-blue-800">qweqzxcaqw</div>
      <div className="grid grid-rows-1 h-full bg-green-800">qweqzxcaqw</div>
    </main>
  );
}
