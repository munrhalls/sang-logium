import { searchProductsByName } from "@/sanity/lib/products/searchProductsByName";
import ProductsGrid from "@/app/components/features/products-view/ProductsGrid";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = params.query;

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
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

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
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
    <div className="flex flex-col items-center justsify-top min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-6">
          Search results for {query}
        </h1>
        <ProductsGrid products={products} />
      </div>
    </div>
  );
}
