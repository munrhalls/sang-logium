import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import TextCommercial from "./textCommercial";
import ProductsCommercial from "./productsCommercial";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";
import Link from "next/link";
import { useMemo } from "react";

type SlideProps = {
  commercial: GET_COMMERCIALS_BY_FEATURE_QUERYResult[number];
  index: number;
  currentIndex: number;
};

const Slide = ({ commercial, index, currentIndex }: SlideProps) => {
  const { image, sale, products, text } = commercial;

  const buttonColor = useMemo(() => {
    if (!text) return "#CF8226";
    const firstColorMark = text[0]?.markDefs?.find(
      (mark) => mark._type === "textColor"
    );
    return firstColorMark?.value || "#CF8226";
  }, [text]);

  if (!image) return null;

  const saleId = sale?._id;
  const discount = sale?.discount || null;

  return (
    <div
      className="z-10 absolute top-0 bottom-0"
      style={{
        width: "100%",
        transform: `translateX(${index * 100}%)`,
        zIndex: currentIndex === index ? 2 : 1,
      }}
    >
      <div className="relative h-full w-full">
        <Image
          src={imageUrl(image).url()}
          width={1920}
          height={1080}
          style={{ objectPosition: "0% 40%" }}
          className="absolute inset-0 w-full h-full object-cover"
          quality={60}
          sizes="100vw"
          alt={commercial.title || "Sale"}
        />
        <div className="h-full w-full sm:pt-4 sm:pb-8 sm:px-12 md:px-32 md:pb-20 md:pt-8 max-w-[1500px] mx-auto">
          <div className="relative h-full w-full">
            <div className=" bg-black/30 grid align-items-center justify-items-center gap-1 px-4 space-y-3 rounded-lg font-oswald text-center text-white text-md 2xs:space-y-6 text-xs 2xs:text-2xl 2xs:px-12 2xs:py-12 lg:text-3xl">
              {text && text.length > 0 && <TextCommercial text={text} />}
              {products && products.length && (
                <ProductsCommercial products={products} discount={discount} />
              )}

              <Link
                href={`/sale/${saleId}`}
                prefetch={true}
                className="inline-block rounded-lg tracking-wide text-sm text-white py-2 px-3 2xs:text-lg 2xs:py-2 2xs:px-6 lg:text-2xl lg:px-8 lg:py-4 "
                style={{ backgroundColor: `${buttonColor}` }}
              >
                SEE NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Slide;
