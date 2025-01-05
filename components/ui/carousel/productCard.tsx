import Image from "next/image";
import Link from "next/link";
import { Commercial } from "@/sanity.types";

const ProductCard = ({ product }: { product: Commercial["products"] }) => {
  if (!product) return null;
  return (
    <Link href={`/product/${product.slug}`} className="group">
      <div className="bg-black/20 rounded-lg p-4">
        <div className="aspect-square relative mb-4">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="text-white">
          <p className="font-bold text-lg truncate">{product.title}</p>
          <div className="flex justify-center gap-4">
            <span className="line-through opacity-60">${product.oldPrice}</span>
            <span className="font-bold">${product.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default ProductCard;
