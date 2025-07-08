import { searchProductsByName } from "@/sanity/lib/products/searchProductsByName";
import ProductsGrid from "@/app/components/features/products/ProductsGrid";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = params.query;
  if (!query) {
    return (
      <div className="flex flex-col items-center justify-top min-h-screen bg-slate-200 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-ful max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-center">
            No products found
          </h1>
          <p className="text-gray text-center">
            Try searching with different keywords
          </p>
        </div>
      </div>
    );
  }
  const products = await searchProductsByName(query);
  const productsCount = products.length;
  if (!productsCount) {
    return (
      <div className="flex flex-col items-center justify-top min-h-screen bg-slate-200 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-ful max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-center">
            No products found for: {query}
          </h1>
          <p className="text-gray text-center">
            Try searching with different keywords
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justsify-top min-h-screen bg-slate-200 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center my-6">
          Search results for: <span className="font-light">{query}</span>
        </h1>
        <p className="text-gray text-center mb-6 font-oswald">
          {productsCount} product{productsCount > 1 ? "s" : ""} found{" "}
        </p>
      </div>
      <div className="rounded-lg w-full max-w-4xl mt-4">
        <ProductsGrid products={products} />
      </div>
    </div>
  );
}
