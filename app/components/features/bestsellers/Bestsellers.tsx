import Image from "next/image";
import LogoOrbit from "@/public/logo-orbit.svg";
import Carousel from "../../ui/carousel/carousel";
import Slide from "../../ui/carousel/slide";
import Link from "next/link";

export default async function Bestsellers() {
  const keys: string[] = [];
  const prebuiltCommercials = Array.from({ length: 15 }).map(
    (_, index: number) => {
      keys.push(`bestseller_${index}`);
      return (
        <div key={index} className="h-full grid bg-purple-700">
          <Link href="/"></Link>
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
      <Slide key={keys[index] + "_Slide"} prebuiltItem={prebuiltCommercial} />
    )
  );

  return (
    <div className="h-1/2">
      <div className="">
        <Image src={LogoOrbit} alt="Logo" width={80} height={80} unoptimized />
        <h1 className="text-black text-4xl">Bestsellers</h1>
      </div>
      <Carousel prebuiltSlides={prebuiltSlides} keys={keys} />;
    </div>
  );
}
