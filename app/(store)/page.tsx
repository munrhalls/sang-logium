import { getAllProducts } from "@/sanity/lib/products/getAllProducts";

import ProductsView from "@/components/ProductsView";

import BlackFridayBanner from "@/components/BlackFridayBanner";
import { Category } from "@/sanity.types";

export default async function Home({ categories }: { categories: Category[] }) {
  const products = await getAllProducts();

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
