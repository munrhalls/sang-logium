import Image from "next/image";
import imageUrl from "@/lib/imageUrl";
import TextOverlay from "./textOverlay";
import ProductsGrid from "./productsGrid";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";

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
      className="absolute top-0 bottom-0 transition-transform duration-450 ease-in-out will-change-transform"
      style={{
        height: "100%",
        width: "100%",
        left: `${index * 100}%`,
        right: `${(index + 1) * 100}%`,
        transform: `translateX(-${currentIndex * 100}%)`,
      }}
    >
      <div className="absolute inset-0 rounded z-40">
        <Image
          src={imageUrl(commercial.image).url()}
          fill
          sizes="100vw"
          className="object-cover object-[50%_0%] md:object-[30%_40%]"
          alt={commercial.title || "Sale"}
          priority
        />
        <TextOverlay text={commercial.text} />
        {products && <ProductsGrid products={products} />}
      </div>
    </div>
  );
};
export default BaseSlide;
