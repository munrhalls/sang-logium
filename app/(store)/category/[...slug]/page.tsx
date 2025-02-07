import getProductsByCategoryPath from "@/sanity/lib/products/getProductsByCategoryPath";
import ProductsGrid from "@/app/components/features/products/ProductsGrid";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const slugs = (await params).slug;
  const path = slugs.join("/");
  console.log(path);
  // const products = await getProductsByCategoryPath(path);
  return (
    <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center">
          {slugs.map((slug) =>
            slug
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          )}
          Collection
        </h1>
        {/* <ProductsGrid products={products} /> */}
      </div>
    </div>
  );
}
