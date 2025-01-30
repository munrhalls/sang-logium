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
      h1: ({ children }) => (
        <h1 className="xs:text-xl md:text-2xl lg:text-3xl font-black text-center">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="xs:text-lg md:text-xl lg:text-2xl font-bold text-center">
          {children}
        </h2>
      ),
      normal: ({ children }) => <p className="text-xl">{children}</p>,
    },
    marks: {
      textColor: ({ value, children }) => (
        <span style={{ color: value?.value || "inherit" }}>{children}</span>
      ),
    },
  };

  return (
    <div className="z-30  h-full w-full grid grid-rows-[auto_1fr_2rem] md:grid-rows-[auto_1fr_3rem] p-4 gap-3 lg:auto-cols-fr">
      <div className="h-full   text-white grid ">
        {text && (
          <div className="z-20">
            <PortableText value={text} components={components} />
          </div>
        )}
      </div>
      <div className="h-full w-full grid grid-flow-col grid-auto-cols-fr">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            discount={discount}
            priceColor={buttonColor}
          />
        ))}
      </div>
      <div className="z-30 h-full min-h-0  text-white grid place-items-center">
        <Link
          href="TODO"
          // prefetch={true}
          className="z-20 grid place-content-centerh-full min-h-0  max-w-[8rem] text-center text-white py-1 font-black px-6 lg:py-2 rounded-sm text-sm lg:text-xl "
          style={{ backgroundColor: `${buttonColor}` }}
        >
          SEE MORE
        </Link>
      </div>
    </div>
  );
}

export default ProductsCommercial;
