import BrandsWall from "../components/features/brands-wall/BrandsWall";
import ExtremeQuality from "../components/features/extreme-quality/ExtremeQuality";
import Bestsellers from "../components/features/bestsellers/Bestsellers";
import MonthProduct from "../components/features/month-product/MonthProduct";
import NewestRelease from "../components/features/newest-release/NewestRelease";
import FeaturedProducts from "../components/features/featured-products/FeaturedProducts";
import MainCategories from "../components/features/main-categories/MainCategories";
import Footer from "@/app/components/layout/footer/Footer";
import HeroCommercials from "../components/features/hero-commercials/HeroCommercials";
import { Suspense } from "react";
export default async function Page() {
  // const categories = await getAllCategories();

  return (
    <main className="h-full">
      <HeroCommercials />

      <div className="h-full max-w-[1400px] mx-auto">
        <BrandsWall />

        <Bestsellers />
        <ExtremeQuality />
        <Suspense fallback={<div>Loading...</div>}>
          <MonthProduct />
        </Suspense>
        <NewestRelease />
        <FeaturedProducts />
        <MainCategories />
        <Footer />
      </div>
    </main>
  );
}
