import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import ProductPageGallery from "./ProductPageGallery";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  console.log(product);
  if (!product) {
    return notFound();
  }

  const isOutOfStock = product.stock != null && product.stock <= 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className={`relative aspect-square overflow-hidden rounded-lg shadow-lg ${isOutOfStock ? "opacity-50" : ""}`}
        >
          <ProductPageGallery product={product} />
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-white font-bold text-lg">Out of stock</span>
          </div>
        )}

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="text-xl font-semibold mb-4">
              ${product.price?.toFixed(2)}
            </div>
            <div className="prose max-w-none mb-6">
              {Array.isArray(product.description) && (
                <PortableText value={product.description} />
              )}
            </div>
            {product.overviewFields && product.overviewFields.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <ul className="list-disc list-inside">
                  {product.overviewFields.map((field, index) => (
                    <li key={index}>
                      <strong>{field.title}:</strong> {field.value}
                      {field.information && (
                        <p className="text-sm text-gray-600">
                          {field.information}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.specifications && product.specifications.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Specifications</h2>
                <ul className="list-disc list-inside">
                  {product.specifications.map((spec, index) => (
                    <li key={index}>
                      <strong>{spec.title}:</strong> {spec.value}
                      {spec.information && (
                        <p className="text-sm text-gray-600">
                          {spec.information}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
