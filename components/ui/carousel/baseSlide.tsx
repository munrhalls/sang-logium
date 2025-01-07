import Image from "next/image";
import imageUrl from "@/lib/imageUrl";
import TextOverlay from "./textOverlay";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";
import ProductsCommercials from "./productCommercials";

const BaseSlide = ({
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
        <div className="h-full w-full">
          {products ? (
            <ProductsCommercials products={products} />
          ) : (
            <TextOverlay text={commercial.text} />
          )}
        </div>
      </div>
    </div>
  );
};
export default BaseSlide;
