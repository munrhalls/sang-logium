import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  console.log(product);
  if (!product) {
    return notFound();
  }

  return (
    <div>
      <h1 className="text-3xl">PRODUCT PAGE</h1>
    </div>
  );
}
