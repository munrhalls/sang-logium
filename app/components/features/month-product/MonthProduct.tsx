import SegmentTitle from "../../ui/segment-title/SegmentTitle";

export default async function MonthProduct() {
  return (
    <div className="h-full w-full bg-orange-800 grid grid-rows-[1fr_4fr]">
      <SegmentTitle title="MVP of the month!" />
      <div className="h-full w-full bg-orange-800 grid">
        <div>time, months mvp product + graphic, description</div>
        <div>image</div>
      </div>
    </div>
  );
}
