import Image from "next/image";
import LogoOrbit from "@/public/logo-orbit.svg";
import Carousel from "../../ui/carousel/carousel";

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
    <div className="w-full bg-teal-800 grid place-content-center">
      <div className="flex items-center justify-center gap-1">
        <Image src={LogoOrbit} alt="Logo" width={60} height={60} unoptimized />
        <h1 className="text-black font-black text-3xl">Bestsellers</h1>
      </div>
      <div className="h-[400px] w-full bg-teal-800">
        <Carousel
          prebuiltSlides={prebuiltCommercials}
          keys={keys}
          responsive={true}
        />
      </div>
      ;
    </div>
  );
}
