import Image from "next/image";
import * as Brands from "@/public/brands";
import LogoOrbit from "@/public/logo-orbit.svg";

export default async function ExtremeQuality() {
  console.log(Object.keys(Brands).map((brand) => brand));
  console.log(Brands);
  return (
    <div className="h-full grid grid-cols-[1fr_5fr_1fr]">
      <div className="h-full pt-8 pb-4 col-start-2 col-end-3 flex justify-center items-center gap-4 gradient">
        <Image src={LogoOrbit} alt="Logo" width={80} height={80} unoptimized />
        <h1 className="text-black text-4xl">Extreme Quality Series</h1>
      </div>
      <div className="h-full">
        <div>extreme quality slide 1</div>
        <div>extreme quality slide 1</div>
        <div>extreme quality slide 1</div>
      </div>
    </div>
  );
}
