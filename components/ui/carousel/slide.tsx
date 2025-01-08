import Image from "next/image";
import imageUrl from "@/lib/imageUrl";
import TextOverlay from "./textCommercial";
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
          src={imageUrl(commercial.image).url()}
          fill
          sizes="100vw"
          className="object-cover object-[15%_0%] md:object-[30%_40%]"
          alt={commercial.title || "Sale"}
          priority
        />
        <div className="h-full w-full pt-4 pb-8 px-12 md:px-32 md:pb-20 md:pt-8 max-w-[1500px] mx-auto">
          {products ? (
            <ProductsCommercial products={products} />
          ) : (
            <TextOverlay text={commercial.text} />
          )}
        </div>
      </div>
    </div>
  );
};
export default Slide;
