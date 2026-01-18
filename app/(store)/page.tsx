import HeroMain from "../components/features/homepage/hero-main/HeroMain";
import HeroCommercialsSkeleton from "../components/features/homepage/hero-commercials/HeroCommercialsSkeleton";
import HeroCommercials from "../components/features/homepage/hero-commercials/HeroCommercials";
import BrandsWall from "../components/features/homepage/brands-wall/BrandsWall";
import BestsellersSkeleton from "../components/features/homepage/bestsellers/BestsellersSkeleton";
import Bestsellers from "../components/features/homepage/bestsellers/Bestsellers";
import NewestReleaseSkeleton from "../components/features/homepage/newest-release/NewestReleaseSkeleton";
import NewestRelease from "../components/features/homepage/newest-release/NewestRelease";
import ExtremeQualitySkeleton from "../components/features/homepage/extreme-quality/ExtremeQualitySkeleton";
import ExtremeQuality from "../components/features/homepage/extreme-quality/ExtremeQuality";
import FeaturedProductsSkeleton from "../components/features/homepage/featured-products/FeaturedProductsSkeleton";
import FeaturedProducts from "../components/features/homepage/featured-products/FeaturedProducts";
import MonthProductSkeleton from "../components/features/homepage/month-product/MonthProductSkeleton";
import MonthProduct from "../components/features/homepage/month-product/MonthProduct";
// import CatalogueBannersSkeleton from "../components/features/homepage/catalogueBanners/CatalogueBannersSkeleton";
// import CatalogueBanners from "../components/features/homepage/catalogueBanners/CatalogueBanners";
import Footer from "../components/layout/footer/Footer";
import { Suspense } from "react";
export const revalidate = 5400;
export const dynamic = "force-static";

// TODO fix HMR ping error
export default async function Page() {
  return (
    <main className="relative h-full overflow-x-hidden">
      <HeroMain />
      <Suspense fallback={<HeroCommercialsSkeleton />}>
        <HeroCommercials />
      </Suspense>
      <div className="mx-auto grid grid-cols-[auto_8fr_auto] xl:grid-cols-[1fr_8fr_1fr]">
        <div className="col-start-2 col-end-3 mx-auto max-w-[1400px]">
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
        <div className="col-start-2 col-end-3 mx-auto max-w-[1400px]">
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
        {/* <div className="col-start-1 col-end-4">
          <Suspense fallback={<CatalogueBannersSkeleton />}>
            <CatalogueBanners />
          </Suspense>
        </div> */}
      </div>
      <Footer />
    </main>
  );
}
