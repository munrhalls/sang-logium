import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import ProductsView from "./components/ProductsView";

export default async function Home() {
  const products = await getAllProducts();

  return (
    <div>
      <h1>Hello world</h1>
      {/* render all prods */}
      <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
        <ProductsView products={products} />
      </div>
    </div>
  );
}
