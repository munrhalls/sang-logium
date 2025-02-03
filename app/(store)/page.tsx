import BrandsWall from "../components/features/brands-wall/BrandsWall";
import ExtremeQuality from "../components/features/extreme-quality/ExtremeQuality";
import Bestsellers from "../components/features/bestsellers/Bestsellers";
import MonthProduct from "../components/features/month-product/MonthProduct";
import NewestRelease from "../components/features/newest-release/NewestRelease";
import FeaturedProducts from "../components/features/featured-products/FeaturedProducts";
import MainCategories from "../components/features/main-categories/MainCategories";
import Footer from "@/app/components/layout/footer/Footer";
import HeroCommercials from "../components/features/hero-commercials/HeroCommercials";

export default async function Page() {
  // const categories = await getAllCategories();

  return (
    <main className="h-full">
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
        <div className="min-h-[400px] md:min-h-[800px] col-start-1 col-end-4">
          <Footer />
        </div>
      </div>
    </main>
  );
}
