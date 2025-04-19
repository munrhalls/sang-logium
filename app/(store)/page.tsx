import BrandsWall from "../components/features/homepage/brands-wall/BrandsWall";
import ExtremeQuality from "../components/features/homepage/extreme-quality/ExtremeQuality";
import Bestsellers from "../components/features/homepage/bestsellers/Bestsellers";
import MonthProduct from "../components/features/homepage/month-product/MonthProduct";
import NewestRelease from "../components/features/homepage/newest-release/NewestRelease";
import FeaturedProducts from "../components/features/homepage/featured-products/FeaturedProducts";
import MainCategories from "../components/features/homepage/main-categories/MainCategories";
import HeroCommercials from "../components/features/homepage/hero-commercials/HeroCommercials";
import Footer from "../components/layout/footer/Footer";

export default async function Page() {
  return (
    <main className="h-full relative">
      <HeroCommercials />

      <div className="grid grid-cols-[auto_8fr_auto] xl:grid-cols-[1fr_8fr_1fr] mx-auto">
        <div className="mx-auto col-start-2 col-end-3 max-w-[1400px]">
          <BrandsWall />
          <Bestsellers />
        </div>
        <div className="col-start-1 col-end-4">
          <NewestRelease />
        </div>
        <div className="mx-auto col-start-2 col-end-3 max-w-[1400px]">
          <ExtremeQuality />
          <FeaturedProducts />
        </div>

        <div className="col-start-1 col-end-4">
          <MonthProduct />
        </div>
        <div className="col-start-1 col-end-4">
          <MainCategories />
        </div>
      </div>
      <Footer />
    </main>
  );
}
