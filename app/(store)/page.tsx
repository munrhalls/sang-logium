import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
import Carousel from "@/app/components/ui/carousel/carousel";
import Slide from "@/app/components/ui/carousel/staticSlide";
import BrandsWall from "../components/features/brands-wall/BrandsWall";
import ExtremeQuality from "../components/features/extreme-quality/ExtremeQuality";
import Bestsellers from "../components/features/bestsellers/Bestsellers";
import MonthProduct from "../components/features/month-product/MonthProduct";
import NewestRelease from "../components/features/newest-release/NewestRelease";
import FeaturedProducts from "../components/features/featured-products/FeaturedProducts";
import MainCategories from "../components/features/main-categories/MainCategories";
// import MobileFooter from "@/app/components/ui/footer/MobileFooter";
import { Suspense } from "react";
import Footer from "@/app/components/layout/footer/Footer";

export default async function Page() {
  const heroCommercials = await getCommercialsByFeature("hero");
  // const categories = await getAllCategories();

  const prebuiltSlides = heroCommercials
    .sort((a, b) => (a?.displayOrder ?? 0) - (b?.displayOrder ?? 0))
    .map((commercial, index) => (
      <Slide key={commercial._id} commercial={commercial} index={index} />
    ));

  const heroCommercialsKeys = heroCommercials.map(
    (commercial) => commercial._id
  );

  return (
    <main className="h-full ">
      <Carousel prebuiltSlides={prebuiltSlides} keys={heroCommercialsKeys} />
      <Suspense
        fallback={
          <div className="h-full grid place-content-center">Loading...</div>
        }
      >
        <BrandsWall />
      </Suspense>
      <Bestsellers />
      <MonthProduct />
      <ExtremeQuality />
      <NewestRelease />
      <FeaturedProducts />
      <MainCategories />
      <Footer />
    </main>
  );
}
