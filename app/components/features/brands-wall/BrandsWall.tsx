import Image from "next/image";
import LogoOrbit from "@/public/logo-orbit.svg";
import * as Brands from "@/public/brands";

export default async function BrandsWall() {
  return (
    <div className="w-full grid grid-cols-[1fr_7fr_1fr] sm:grid-cols-[1fr_5fr_1fr]">
      <div className="h-full pt-8 pb-4 col-start-2 col-end-3 flex justify-center items-center gap-4 gradient">
        <Image src={LogoOrbit} alt="Logo" width={60} height={60} unoptimized />
        <h1 className="text-black font-black text-3xl">
          World`s best audio gear
        </h1>
      </div>
      <div className="h-full col-start-2 col-end-3 grid grid-cols-2 2xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-12">
        {Object.entries(Brands).map(([brand, image]) => {
          return (
            <div key={brand} className="grid place-content-center">
              <Image
                loading="lazy"
                src={image.src}
                alt={brand}
                quality={70}
                sizes="150px"
                width={150}
                height={50}
                unoptimized
                className="max-h-full max-w-full object-contain"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
