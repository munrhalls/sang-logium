import Image from "next/image";
import LogoOrbit from "@/public/logo-orbit.svg";
import Carousel from "../../ui/carousel/carousel";
import Slide from "../../ui/carousel/slide";

export default async function Bestsellers() {
  const prebuiltCommercials = Array.from({ length: 10 }).map(
    (_, index: number) => <div key={index}>product bestseller {index}</div>
  );

  // const prebuiltCommercials = bestSellerCommercials
  //   .sort((a, b) => (a?.displayOrder ?? 0) - (b?.displayOrder ?? 0))
  //   .map((commercial, index) => (
  //     <Slide key={commercial._id} commercial={commercial} index={index} />
  //   ));

  // const bestSellerCommercialsKeys = bestSellerCommercials.map(
  //   (commercial) => commercial._id
  // );

  return (
    <div className="h-full grid grid-cols-[1fr_5fr_1fr]">
      <div className="h-full pt-8 pb-4 col-start-2 col-end-3 flex justify-center items-center gap-4 gradient">
        <Image src={LogoOrbit} alt="Logo" width={80} height={80} unoptimized />
        <h1 className="text-black text-4xl">Bestsellers</h1>
      </div>
      <div className="h-full grid-cols-[2fr_3fr]">
        {/* <Carousel slides={prebuiltSlides} keys={bestSellerCommercialsKeys} /> */}
      </div>
    </div>
  );
}
