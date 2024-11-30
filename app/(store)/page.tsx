import { getAllProducts } from "@/sanity/lib/products/getAllProducts";

import { getAllCategories } from "@/sanity/lib/products/getAllCategories";

import ProductsView from "@/components/ProductsView";

import BlackFridayBanner from "@/components/BlackFridayBanner";
import MobileCategoriesDrawer from "@/components/ui/mobile-categories-drawer";
import DesktopCategoriesNav from "@/components/DesktopCategoriesNav";
import MobileSearchDrawer from "@/components/ui/mobile-search-drawer";

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  return (
    <div>
      <DesktopCategoriesNav categories={categories} />
      <BlackFridayBanner />
      {/* render all prods */}
      <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
        <ProductsView products={products} categories={categories} />
        <MobileSearchDrawer />
        <MobileCategoriesDrawer categories={categories} />
      </div>
    </div>
  );
}
