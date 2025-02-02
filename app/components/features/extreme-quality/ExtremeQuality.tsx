import Carousel from "../../ui/carousel-single-slide/carouselSingleSlide";
import SegmentTitle from "../../ui/segment-title/SegmentTitle";

export default async function ExtremeQuality() {
  const keys: string[] = [];
  const prebuiltCommercials = Array.from({ length: 3 }).map(
    (_, index: number) => {
      keys.push(`bestseller_${index}`);
      return (
        <div
          key={index + "_Bestsellers"}
          className="h-full w-full p-4 grid place-items-center relative  border border-black"
        >
          <div className="h-full w-full max-w-[300px]  grid grid-rows-[auto_2fr_auto]">
            <div className="">brand {index}</div>
            <div className="h-full ">image</div>
            <div>price</div>
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
