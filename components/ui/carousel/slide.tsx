import Image from "next/image";
import { heroImageUrl } from "@/lib/imageUrl";
import TextCommercial from "./textCommercial";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";
import ProductsCommercial from "./productsCommercial";

const Slide = ({
  commercial,
  index,
  currentIndex,
}: {
  commercial: GET_COMMERCIALS_BY_FEATURE_QUERYResult[0];
  index: number;
  currentIndex: number;
}) => {
  if (!commercial.image) return null;

  const products = commercial.products;

  return (
    <div
      className="z-10 absolute top-0 bottom-0 transition-transform duration-450 ease-in-out will-change-transform"
      style={{
        height: "100%",
        width: "100%",
        left: `${index * 100}%`,
        right: `${(index + 1) * 100}%`,
        transform: `translateX(-${currentIndex * 100}%)`,
      }}
    >
      <div className="relative h-full w-full">
        <Image
          src={heroImageUrl(commercial.image).url()}
          width={1920}
          height={1080}
          style={{ objectPosition: "0% 40%" }}
          className="absolute inset-0 w-full h-full object-cover"
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
          quality={85}
          sizes="100vw"
          alt={commercial.title || "Sale"}
        />
        <div className="h-full w-full sm:pt-4 sm:pb-8 sm:px-12 md:px-32 md:pb-20 md:pt-8 max-w-[1500px] mx-auto">
          {products ? (
            <ProductsCommercial products={products} />
          ) : (
            <TextCommercial text={commercial.text} />
          )}
        </div>
      </div>
    </div>
  );
};
export default Slide;
