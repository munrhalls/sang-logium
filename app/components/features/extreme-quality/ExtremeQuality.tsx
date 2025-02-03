import Carousel from "../../ui/carousel-single-slide/carouselSingleSlide";
import SegmentTitle from "../../ui/segment-title/SegmentTitle";
import BrandTitle from "../../ui/commercials/minor/brandTitle";
import Price from "../../ui/commercials/minor/price";

export default async function ExtremeQuality() {
  const keys: string[] = [];
  const image = { width: 500, height: 500, title: "Square (1:1)" };

  const prebuiltCommercials = Array.from({ length: 3 }).map(
    (_, index: number) => {
      keys.push(`bestseller_${index}`);
      return (
        <div
          key={index + "_Bestsellers"}
          className="h-full w-full p-4 grid place-items-center relative  border border-black bg-slate-400"
        >
          <div className="h-full w-full max-w-[300px]  grid grid-rows-[auto_2fr_auto]">
            <BrandTitle brand={"Sony"} />
            <div className="h-full ">
              <img
                src={`https://picsum.photos/${image.width}/${image.height}`}
                height={image.height}
                width={image.width}
                alt={image.title}
                className="w-full h-full object-cover rounded-sm"
              />
            </div>
            <Price price={2599.99} priceColor={"blue"} />
          </div>
        </div>
      );
    }
  );

  return (
    <div className="w-full  grid grid-rows-[1fr_4fr]">
      <SegmentTitle title="Extreme Quality Series" />
      <div className="h-full min-h-[400px] w-full">
        <Carousel prebuiltSlides={prebuiltCommercials} keys={keys} />
      </div>
    </div>
  );
}
