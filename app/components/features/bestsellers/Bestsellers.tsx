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
          className="h-full w-full relative bg-purple-700 border border-black"
        >
          {index}
        </div>
      );
    }
  );

  return (
    <div className="h-full max-h-[400px]">
      <div className="pt-8 pb-4 col-start-2 col-end-3 flex justify-center items-center gap-4 gradient">
        <Image src={LogoOrbit} alt="Logo" width={60} height={60} unoptimized />
        <h1 className="text-black font-black text-3xl">Bestsellers</h1>
      </div>
      <Carousel
        prebuiltSlides={prebuiltCommercials}
        keys={keys}
        responsive={true}
      />
      ;
    </div>
  );
}
