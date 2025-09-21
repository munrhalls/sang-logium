import BrandsWall from "../components/features/homepage/brands-wall/BrandsWall";
import Bestsellers from "../components/features/homepage/bestsellers/Bestsellers";
import BestsellersSkeleton from "../components/features/homepage/bestsellers/BestsellersSkeleton";

import NewestRelease from "../components/features/homepage/newest-release/NewestRelease";
import NewestReleaseSkeleton from "../components/features/homepage/newest-release/NewestReleaseSkeleton";
import ExtremeQuality from "../components/features/homepage/extreme-quality/ExtremeQuality";
import ExtremeQualitySkeleton from "../components/features/homepage/extreme-quality/ExtremeQualitySkeleton";

import FeaturedProducts from "../components/features/homepage/featured-products/FeaturedProducts";
import FeaturedProductsSkeleton from "../components/features/homepage/featured-products/FeaturedProductsSkeleton";
import MonthProduct from "../components/features/homepage/month-product/MonthProduct";
import MonthProductSkeleton from "../components/features/homepage/month-product/MonthProductSkeleton";

import MainCategories from "../components/features/homepage/main-categories/MainCategories";
import HeroCommercials from "../components/features/homepage/hero-commercials/HeroCommercials";
import Footer from "../components/layout/footer/Footer";
import { Suspense } from "react";
export const revalidate = 300;
export const dynamic = "force-static";

export default async function Page() {
  // TODO BATCH FETCH ALL COMMERCIALS THERE

  return (
    <main className="h-full relative overflow-x-hidden">
      <HeroCommercials />
      <div className="grid grid-cols-[auto_8fr_auto] xl:grid-cols-[1fr_8fr_1fr] mx-auto">
        <div className="mx-auto col-start-2 col-end-3 max-w-[1400px]">
          <BrandsWall />
          <Suspense fallback={<BestsellersSkeleton />}>
            <Bestsellers />
          </Suspense>
        </div>
        <div className="col-start-1 col-end-4">
          <Suspense fallback={<NewestReleaseSkeleton />}>
            <NewestRelease />
          </Suspense>
        </div>
        <div className="mx-auto col-start-2 col-end-3 max-w-[1400px]">
          <Suspense fallback={<ExtremeQualitySkeleton />}>
            <ExtremeQuality />
          </Suspense>
          <Suspense fallback={<FeaturedProductsSkeleton />}>
            <FeaturedProducts />
          </Suspense>
        </div>
        <div className="col-start-1 col-end-4">
          <Suspense fallback={<MonthProductSkeleton />}>
            <MonthProduct />
          </Suspense>
        </div>
        <div className="col-start-1 col-end-4">
          <MainCategories />
        </div>
      </div>
      <Footer />
    </main>
  );
}
