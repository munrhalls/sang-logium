import getProductsBySaleSlug from "@/sanity/lib/products/getProductsBySaleSlug";

export default async function SalePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const products = await getProductsBySaleSlug(slug);
  console.log(products.map((product) => product.name));

  return (
    <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center">
          {slug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
          SALE
        </h1>
        {/* <ProductsGrid products={products} /> */}
      </div>
    </div>
  );
}
