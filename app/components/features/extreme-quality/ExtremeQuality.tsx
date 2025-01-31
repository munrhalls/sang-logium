import Carousel from "../../ui/carousel/carousel";
import SegmentTitle from "../../ui/segment-title/SegmentTitle";

export default async function ExtremeQuality() {
  const keys: string[] = [];
  const prebuiltCommercials = Array.from({ length: 3 }).map(
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
    <div className="w-full bg-indigo-800 grid grid-rows-[1fr_4fr]">
      <SegmentTitle title="Extreme Quality Series" />
      <div className="h-full min-h-[400px] w-full bg-teal-800">
        <Carousel
          prebuiltSlides={prebuiltCommercials}
          keys={keys}
          responsive={true}
        />
      </div>
    </div>
  );
}
