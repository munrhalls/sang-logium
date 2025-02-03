import CarouselMultiSlide from "../../ui/carousel-multi-slide/carouselMultiSlide";
import SegmentTitle from "../../ui/segment-title/SegmentTitle";
// import Image from "next/image";
import Price from "../../ui/commercials/minor/price";
import BrandTitle from "../../ui/commercials/minor/brandTitle";
import ProductName from "../../ui/commercials/minor/productName";
import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";

type Product = {
  _id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
};

function isProduct(item: any): item is Product {
  return (
    typeof item?._id === "string" &&
    typeof item?.name === "string" &&
    typeof item?.brand === "string" &&
    typeof item?.price === "number" &&
    typeof item?.image === "string"
  );
}

export default async function Bestsellers() {
  const [commercial] = await getCommercialsByFeature("bestsellers");
  const bestsellers = commercial.products;
  const verified = bestsellers?.filter(isProduct);

  const keys: string[] =
    verified?.map((bestseller) => bestseller._id + "_carousel") || [];

  const prebuilt = verified?.map((bestseller) => {
    return (
      <div
        key={bestseller._id + "_bestseller"}
        className="h-full w-full p-4 grid place-items-center relative "
      >
        <div className="h-full w-full max-w-[300px] grid grid-rows-[auto_2fr_auto] border border-black">
          <BrandTitle brand={bestseller.brand} />
          <div className="h-full w-full">
            <Image
              src={imageUrl(bestseller.image).url()}
              height={300}
              width={300}
              alt={bestseller.brand}
              className="w-full h-full object-cover"
            />
          </div>
          <ProductName name={bestseller.name} />
          <Price price={bestseller.price} priceColor="rgb(242 132 0)" />
        </div>
      </div>
    );
  });

  return (
    <div className="w-full  grid grid-rows-[1fr_4fr]">
      <SegmentTitle title="Bestsellers" />
      <div className="h-full min-h-[400px] w-full ">
        {prebuilt && (
          <CarouselMultiSlide prebuiltSlides={prebuilt} keys={keys} />
        )}
      </div>
    </div>
  );
}
