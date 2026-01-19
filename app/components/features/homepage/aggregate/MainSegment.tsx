import { Suspense } from "react";
import BrandsWall from "../banners/brands-wall/BrandsWall";
import BestsellersSkeleton from "../product-showcase/bestsellers/BestsellersSkeleton";
import Bestsellers from "../product-showcase/bestsellers/Bestsellers";
import NewestReleaseSkeleton from "../product-showcase/newest-release/NewestReleaseSkeleton";
import NewestRelease from "../product-showcase/newest-release/NewestRelease";
import ExtremeQualitySkeleton from "../product-showcase/extreme-quality/ExtremeQualitySkeleton";
import ExtremeQuality from "../product-showcase/extreme-quality/ExtremeQuality";
import FeaturedProductsSkeleton from "../product-showcase/featured-products/FeaturedProductsSkeleton";
import FeaturedProducts from "../product-showcase/featured-products/FeaturedProducts";

export default function MainSegment() {
  return (
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
    </div>
  );
}
