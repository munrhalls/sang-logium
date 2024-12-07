import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";

import ProductsView from "@/components/ProductsView";

import BlackFridayBanner from "@/components/BlackFridayBanner";

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  return (
    <div>
      <BlackFridayBanner />
      {/* render all prods */}
      <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  );
}
