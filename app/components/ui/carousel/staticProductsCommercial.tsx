import { ProductProps, ProductCard } from "./staticProductCard";
import Link from "next/link";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";

type CommercialText = NonNullable<
  GET_COMMERCIALS_BY_FEATURE_QUERYResult[number]["text"]
>;

type ProductsProps = {
  products: ProductProps[];
  discount: number | null;
  text: CommercialText;
};

function ProductsCommercial({ products, discount, text }: ProductsProps) {
  const buttonColor =
    text[0]?.markDefs?.find((mark) => mark._type === "textColor")?.value ||
    "#CF8226";

  return (
    <div className="z-30 h-full w-full grid grid-rows-[3rem_1fr_3rem] p-4 gap-3 lg:auto-cols-fr">
      <div className="h-full bg-green">hey</div>
      <div className="h-full grid">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            discount={discount}
          />
        ))}
      </div>
      <div className="z-30 h-full bg-green text-white">
        <Link
          href="asdasaxzc"
          prefetch={true}
          className="z-20 h-full block max-w-[10rem] text-center text-xl text-white font-black px-6 py-2 rounded-sm mt-4 md:mt-12"
          style={{ backgroundColor: `${buttonColor}` }}
        >
          SEE MORE
        </Link>
      </div>
    </div>
  );
}

export default ProductsCommercial;
