import { Product } from "@/sanity.types";
import Image from "next/image";
import Link from "next/link";
import { MouseEvent } from "react";
import { imageUrl } from "@/lib/imageUrl";
import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import BasketControls from "../basket/BasketControls";
import { BasketProduct } from "@/app/components/features/basket/BasketControls";

interface ProductThumbProps {
  product: Product;
  // saleDiscount?: number;
}

// const ProductThumb = ({ product, saleDiscount }: ProductThumbProps) => {
const ProductThumb = ({ product }: ProductThumbProps) => {
  if (
    !product.name ||
    !product.image ||
    product.stock === undefined ||
    !product.price
  )
    return null;

  const isOutOfStock = product.stock != null && product.stock <= 0;

  const originalPrice = product.price ?? 0;
  // const salePrice =
  //   saleDiscount && originalPrice
  //     ? originalPrice - originalPrice * (saleDiscount / 100)
  //     : originalPrice;

  const showPrice = product.price !== undefined;

  const basketProduct: BasketProduct = {
    _id: product._id,
    name: product.name,
    stock: product.stock,
    price: product.price,
  };

  return (
    <Link
      href={`/product/${product._id}`}
      className={`group flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden
        hover:bg-gray-100 hover:border-gray-300
        ${isOutOfStock ? "opacity-50" : ""}`}
    >
      <div className="p-4">
        <Image
          src={imageUrl(product.image).url()}
          alt={product?.name}
          height={300}
          width={300}
          className="aspect-square rounded-sm"
        />

        <h2 className="pt-2 text-lg font-semibold text-gray-800 ">
          {product.name}
        </h2>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {product.description
            ?.map((block) =>
              block._type === "block"
                ? block.children?.map((child) => child.text).join("")
                : ""
            )
            .join(" ") || "No description available"}
        </p>

        <div className="flex flex-col items-center justify-around mt-2">
          <div className="mt-2 flex flex-col items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-gray-900">
                ${originalPrice.toFixed(2)}
              </p>
            </div>
          </div>{" "}
          {!isOutOfStock && <BasketControls product={basketProduct} />}
        </div>
      </div>
    </Link>
  );
};

export default ProductThumb;
