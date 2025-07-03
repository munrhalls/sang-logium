import { getProductById } from "@/sanity/lib/products/getProductById";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import ProductPageGallery from "./ProductPageGallery";
import { FaCheckCircle } from "react-icons/fa";
import InfoTooltip from "@/app/components/ui/infoTooltip/infoTooltip";
import BasketControls from "@/app/components/features/basket/BasketControls";

function isValidProduct(product: any): product {
  return product && product.name && product.price;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const product = await getProductById(id);
  if (!isValidProduct(product)) {
    return notFound();
  }

  const isOutOfStock = product.stock != null && product.stock <= 0;

  // const item = basket.find((i) => i.id === product._id);

  return (
    <div className="mx-auto max-w-[1400px] grid justify-center p-4 gap-4 lg:gap-12 xl:gap-16 sm:grid-cols-2 auto-rows-min">
      <ProductPageGallery product={product} />

      <div className="grid items-center">
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="text-3xl font-semibold mb-4">
            ${product.price.toFixed(2)}
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
          <div>
            <div className="flex items-center gap-1 my-2">
              <span className="text-green-700  font-bold text-xl rounded-sm">
                In stock & shipping
              </span>
              <FaCheckCircle color="green" size={16} />
            </div>
            <BasketControls product={product} />
          </div>
        )}
      </div>
      {product.overviewFields && product.overviewFields.length > 0 && (
        <div className="mb-6 md:max-w-[500px] border-l-2 border-b-2 pl-4 pb-4 border-gray-400 ">
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
        <div className=" mb-6 md:max-w-[500px] border-l-2 border-b-2 border-gray-400 pl-4 pb-4">
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
