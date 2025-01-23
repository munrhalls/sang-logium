import { PortableText } from "@portabletext/react";
import { PortableTextComponents } from "@portabletext/react";
import { ProductProps, ProductCard } from "./staticProductCard";
import Link from "next/link";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";

type CommercialText = GET_COMMERCIALS_BY_FEATURE_QUERYResult[number]["text"];

function ProductsCommercial({
  products,
  discount,
  text,
}: {
  products: ProductProps[];
  discount: number | null;
  text: CommercialText;
}) {
  const buttonColor =
    text?.[0]?.markDefs?.find((mark) => mark._type === "textColor")?.value ||
    "#CF8226";

  const components: PortableTextComponents = {
    block: {
      h1: ({ children }) => <h1 className="text-2xl font-black">{children}</h1>,
      h2: ({ children }) => <h2 className="text-xl font-bold">{children}</h2>,
      normal: ({ children }) => <p className="text-xl">{children}</p>,
    },
    marks: {
      textColor: ({ value, children }) => (
        <span style={{ color: value?.value || "inherit" }}>{children}</span>
      ),
    },
  };

  return (
    <div className="z-30 h-full w-full grid grid-rows-[auto_1fr_3rem] p-4 gap-3 lg:auto-cols-fr">
      <div className="h-full bg-green bg-black/40 text-white grid ">
        {text && (
          <div className="z-20">
            <PortableText value={text} components={components} />
          </div>
        )}
      </div>
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
