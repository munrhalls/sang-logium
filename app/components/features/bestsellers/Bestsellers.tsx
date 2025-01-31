import Image from "next/image";
import LogoOrbit from "@/public/logo-orbit.svg";
import Carousel from "../../ui/carousel/carousel";
import Slide from "../../ui/carousel/slide";

export default async function Bestsellers() {
  const keys: string[] = [];
  const prebuiltCommercials = Array.from({ length: 15 }).map(
    (_, index: number) => {
      keys.push(`bestseller_${index}`);
      return (
        <div
          key={index}
          className="h-full w-full p-3 grid place-items-center bg-purple-700 border border-black"
        >
          {index}
        </div>
      );
    }
  );

  // const prebuiltCommercials = heroCommercials
  //   .sort((a, b) => (a?.displayOrder ?? 0) - (b?.displayOrder ?? 0))
  //   .map((commercial, index) => {
  //     keys.push(commercial._id);
  //     return (
  //       <HeroCommercialItem
  //         key={commercial._id + "_HeroCommercialItem"}
  //         commercial={commercial}
  //         index={index}
  //       />
  //     );
  //   });

  const prebuiltSlides = prebuiltCommercials.map(
    (prebuiltCommercial, index) => (
      <Slide
        key={keys[index] + "_Slide"}
        prebuiltItem={prebuiltCommercial}
        multiplePerScreen={true}
      />
    )
  );

  return (
    <div className="h-full max-h-[400px]">
      <div className="pt-8 pb-4 col-start-2 col-end-3 flex justify-center items-center gap-4 gradient">
        <Image src={LogoOrbit} alt="Logo" width={60} height={60} unoptimized />
        <h1 className="text-black font-black text-3xl">Bestsellers</h1>
      </div>
      <Carousel prebuiltSlides={prebuiltSlides} keys={keys} />;
    </div>
  );
}
