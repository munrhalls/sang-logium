// products.tsx
import Image from "next/image";
import Link from "next/link";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";

type Product = NonNullable<
  GET_COMMERCIALS_BY_FEATURE_QUERYResult[0]["products"]
>[0];

const ProductCard = ({ product }: { product: Product }) => {
  if (!product) return null;
  const discountPrice = product.price * (1 - product.discount / 100);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="z-30 bg-black/40 rounded-lg w-[250px]"
    >
      <div className="flex gap-3">
        <div className="relative w-[60px] h-[60px] shrink-0">
          <Image
            src={product.image}
            alt={product.name || "Product"}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div className="min-w-0">
          {/* Container for text content */}
          <p className="text-sm text-white truncate">{product.name}</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-gray-300 text-sm line-through">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-lightpromotion text-lg font-bold">
              ${discountPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const ProductsCommercials = ({ products }: { products: Product[] }) => {
  if (!products?.length) return null;

  return (
    <div className="grid md:grid-cols-3 gap-4 max-w-[800px] place-content-center">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductsCommercials;
