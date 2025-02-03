// import Image from "next/image";
// import LogoOrbit from "@/public/logo-orbit.svg";
import SegmentTitle from "../../ui/segment-title/SegmentTitle";
export default function NewestRelease() {
  const image = { width: 400, height: 300, title: "Square (1:1)" };
  return (
    <div className="md:min-h-[800px] grid grid-rows-[1fr_4fr]">
      <SegmentTitle title="Newest Release" />
      <div className="h-full grid-cols-[2fr_3fr]">
        <div className="relative h-full w-full">
          <img
            src={`https://picsum.photos/${image.width}/${image.height}`}
            height={image.height}
            width={image.width}
            alt={image.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
