import { getProductById } from "@/sanity/lib/products/getProductById";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import ProductPageGallery from "./ProductPageGallery";
import { FaCheckCircle } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import InfoTooltip from "@/app/components/ui/infoTooltip/infoTooltip";
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const product = await getProductById(id);
  console.log("PRODUCT ", product);
  if (!product) {
    return notFound();
  }

  const isOutOfStock = product.stock != null && product.stock <= 0;

  return (
    <div className="grid justify-center p-4 gap-4 sm:grid-cols-2 auto-rows-min">
      <ProductPageGallery product={product} />

      <div className="grid items-center">
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="text-3xl font-semibold mb-4">
            ${product.price?.toFixed(2)}
          </div>
        </div>

        <div className="mb-6">
          {Array.isArray(product.description) && (
            <PortableText value={product.description} />
          )}
        </div>

        {isOutOfStock ? (
          <div className="">
            <span className="text-white font-bold text-lg rounded-sm">
              Out of stock
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <span className="text-green-700  font-bold text-xl rounded-sm">
              In stock & shipping
            </span>
            <FaCheckCircle color="green" size={16} />
          </div>
        )}

        <button className="align-self-end text-xl bg-blue-950 text-white font-black p-4">
          ADD TO CART
        </button>
      </div>
      {product.overviewFields && product.overviewFields.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Overview</h2>
          <ul className="list-disc list-inside">
            {product.overviewFields.map((field, index) => (
              <li key={index}>
                <strong>{field.title}:</strong> {field.value}
                {field.information && (
                  <span className="ml-1 mt-1">
                    <InfoTooltip information={field.information} />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {product.specifications && product.specifications.length > 0 && (
        <div className=" mb-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Specifications
          </h2>
          <ul className="list-disc list-inside">
            {product.specifications.map((spec, index) => (
              <li key={index}>
                <strong>{spec.title}:</strong> {spec.value}
                {spec.information && (
                  <span className="ml-1 mt-1">
                    <InfoTooltip information={spec.information} />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
