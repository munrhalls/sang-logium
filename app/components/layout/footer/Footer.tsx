import SegmentTitle from "../../ui/segment-title/SegmentTitle";
const ColTitle = function ({ title }: { title: string }) {
  return (
    <div className="h-full grid justify-center content-start p-2 text-white font-black">
      <h1>{title}</h1>
    </div>
  );
};

export default function Footer() {
  return (
    <footer className="h-full bg-black grid grid-rows-[4rem_1fr]  text-white py-4">
      <SegmentTitle title="Sang Logium" white={true} />
      <div className="grid grid-cols-3 justify-content-center py-8">
        <div className="h-full grid justify-center content-start">
          <ColTitle title="SUPPORT" />
        </div>
        <div className="h-full grid justify-center content-start">
          <ColTitle title="COMMUNITY" />
        </div>
        <div className="h-full grid justify-center content-start">
          <ColTitle title="BEST BRANDS" />
        </div>
      </div>
    </footer>
  );
}
