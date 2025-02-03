import Carousel from "../../ui/carousel-single-slide/carouselSingleSlide";
import SegmentTitle from "../../ui/segment-title/SegmentTitle";
import BrandTitle from "../../ui/commercials/minor/brandTitle";
import Price from "../../ui/commercials/minor/price";
import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import { BlockContent } from "@/sanity.types";
import { PortableText } from "@portabletext/react";

type Product = {
  _id: string;
  name: string;
  brand: string;
  description: BlockContent;
  price: number;
  image: string;
};

function isProduct(item: unknown): item is Product {
  return (
    typeof item === "object" &&
    item !== null &&
    typeof (item as Product)._id === "string" &&
    typeof (item as Product).name === "string" &&
    typeof (item as Product).brand === "string" &&
    typeof (item as Product).description === "object" &&
    typeof (item as Product).price === "number" &&
    typeof (item as Product).image === "string"
  );
}

export default async function ExtremeQuality() {
  const [commercial] = await getCommercialsByFeature("extreme-quality");
  if (!commercial || !commercial.products) return null;

  const eqproducts = commercial?.products;
  const verified = eqproducts?.filter(isProduct);
  const keys: string[] =
    verified?.map((eqproduct) => eqproduct._id + "_eqcarousel") || [];

  const prebuiltCommercials = verified?.map((eqproduct) => {
    return (
      <div
        key={eqproduct._id + "_eqproduct"}
        className="h-full p-4 grid md:grid-cols-[5fr_2fr] relative border border-black"
      >
        <div className="h-full w-full grid grid-rows-[4rem_2fr]">
          <BrandTitle brand={eqproduct.brand} />
          <div className="h-full">
            <Image
              loading="lazy"
              src={imageUrl(eqproduct.image).url()}
              quality={95}
              height={400}
              width={400}
              alt={"eqproduct.brand"}
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
          <div className="my-2 grid place-content-center">
            <span className="ml-1 font-black sm:font-black text-xs sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
              ${eqproduct.price.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="h-full w-full grid place-content-center ">
          <p>{eqproduct.name}</p>
          <PortableText value={eqproduct.description} />
        </div>
      </div>
    );
  });

  return (
    <div className="w-full grid grid-rows-[1fr_5fr]">
      <SegmentTitle title="Extreme Quality Series" />
      <div className="h-full min-h-[800px] w-full">
        <Carousel prebuiltSlides={prebuiltCommercials} keys={keys} />
      </div>
    </div>
  );
}
