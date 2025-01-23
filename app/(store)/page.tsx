import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
import Carousel from "@/app/components/ui/carousel/carousel";
import Slide from "@/app/components/ui/carousel/staticSlide";
import MobileFooter from "@/app/components/ui/footer/MobileFooter";

export default async function Page() {
  const heroCommercials = await getCommercialsByFeature("hero");
  const categories = await getAllCategories();

  const prebuiltSlides = heroCommercials
    .sort((a, b) => (a?.displayOrder ?? 0) - (b?.displayOrder ?? 0))
    .map((commercial, index) => (
      <Slide key={commercial._id} commercial={commercial} index={index} />
    ));

  const heroCommercialsKeys = heroCommercials.map(
    (commercial) => commercial._id
  );

  return (
    <main className="h-full bg-blue-800">
      <Carousel prebuiltSlides={prebuiltSlides} keys={heroCommercialsKeys} />
      <div className="h-full bg-orange-800 text-white">qweqwqew</div>
      <div className="h-full bg-purple-800 text-white">qweqwqew</div>
      <div className="h-full bg-teal-800 text-white">qweqwqew</div>
      <div className="h-full bg-emerald-700 text-white">qweqwqew</div>
    </main>
  );
}
