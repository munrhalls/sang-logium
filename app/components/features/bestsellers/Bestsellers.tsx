import CarouselMultiSlide from "../../ui/carousel-multi-slide/carouselMultiSlide";
import SegmentTitle from "../../ui/segment-title/SegmentTitle";
// import Image from "next/image";
import Price from "../../ui/commercials/minor/price";
import BrandTitle from "../../ui/commercials/minor/brandTitle";
import ProductName from "../../ui/commercials/minor/productName";
export default async function Bestsellers() {
  const keys: string[] = [];
  const image = { width: 300, height: 300, title: "Square (1:1)" };

  const prebuiltCommercials = Array.from({ length: 15 }).map(
    (_, index: number) => {
      keys.push(`bestseller_${index}`);
      return (
        <div
          key={index + "_Bestsellers"}
          className="h-full w-full p-4 grid place-items-center relative "
        >
          <div className="h-full w-full max-w-[300px]  grid grid-rows-[auto_2fr_auto] border border-black">
            <BrandTitle brand="Sennheiser" />
            <div className="h-full ">
              <img
                src={`https://picsum.photos/${image.width}/${image.height}`}
                height={image.height}
                width={image.width}
                alt={image.title}
                className="w-full h-full object-cover"
              />
            </div>

            <ProductName
              name={
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquamomnis voluptatum eaque sed cumque repudiandae qui! ObcaecatiKV-3000."
              }
            />
            <Price price={159.99} priceColor={"blue"} />
          </div>
        </div>
      );
    }
  );

  return (
    <div className="w-full  grid grid-rows-[1fr_4fr]">
      <SegmentTitle title="Bestsellers" />
      <div className="h-full min-h-[400px] w-full ">
        <CarouselMultiSlide prebuiltSlides={prebuiltCommercials} keys={keys} />
      </div>
    </div>
  );
}
