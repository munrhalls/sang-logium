import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return (
    <div>
      <h1 className="text-3xl">{product.name}</h1>
    </div>
  );
}
