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
    <div className="z-30 h-full w-full grid grid-rows-[auto_1fr_2rem] md:grid-rows-[auto_1fr_auto] pb-1 2xs:py-2 md:py-4 lg:auto-cols-fr gap-1">
      <div className="h-full text-white grid md:py-4 lg:py-6 xl:py-10  2xs:grid-cols-[1fr_1fr_1fr]">
        {text && (
          <div className="z-20 2xs:col-start-2 2xs:col-end-3 bg-black/40 rounded-sm p-4">
            <PortableText value={text} components={components} />
          </div>
        )}
      </div>

      <div className="h-full w-full max-w-[750px] lg:max-w-[1000px] xl:max-w-[1400px] mx-auto grid grid-flow-col auto-cols-fr place-items-center px-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            discount={discount}
            priceColor={buttonColor}
          />
        ))}
      </div>

      <div className="z-30 h-full min-h-0  text-white grid  place-items-center md:py-4 lg:py-6 xl:py-10">
        <Link
          href="TODO"
          // prefetch={true}
          className="z-20 grid place-content-centerh-full min-h-0  max-w-[10rem] text-center text-white py-1 font-black px-6 lg:py-2 rounded-sm text-sm lg:text-xl "
          style={{ backgroundColor: `${buttonColor}` }}
        >
          SEE MORE
        </Link>
      </div>
    </div>
  );
}

export default ProductsCommercial;
