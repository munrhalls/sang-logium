import CarouselMultiSlide from "../../ui/carousel-multi-slide/carouselMultiSlide";
import SegmentTitle from "../../ui/segment-title/SegmentTitle";

export default async function Bestsellers() {
  const keys: string[] = [];
  const prebuiltCommercials = Array.from({ length: 15 }).map(
    (_, index: number) => {
      keys.push(`bestseller_${index}`);
      return (
        <div
          key={index + "_Bestsellers"}
          className="h-full w-full p-4 grid place-items-center relative bg-purple-700 border border-black"
        >
          <div className="h-full w-full max-w-[300px] bg-orange-700 grid grid-rows-[auto_2fr_auto]">
            <div className="">brand {index}</div>
            <div className="h-full bg-teal-700">image</div>
            <div>price</div>
          </div>
        </div>
      );
    }
  );

  return (
    <div className="w-full bg-teal-800 grid grid-rows-[1fr_4fr]">
      <SegmentTitle title="Bestsellers" />
      <div className="h-full min-h-[400px] w-full bg-teal-800">
        <CarouselMultiSlide
          prebuiltSlides={prebuiltCommercials}
          keys={keys}
          responsive={true}
        />
      </div>
    </div>
  );
}
