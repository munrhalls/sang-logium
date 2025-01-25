import Image from "next/image";
import * as Brands from "@/public/brands";
import globe from "@/public/globe.svg";

export default async function BrandsWall() {
  console.log(Object.keys(Brands).map((brand) => brand));
  console.log(Brands);
  return (
    <div className="h-full grid">
      <div className="h-full flex justify-center items-center gap-4">
        <Image src={globe} alt="Logo" width={48} height={48} unoptimized />
        <h1 className="text-black text-4xl">World`s best audio</h1>
      </div>
      <div className="h-full grid grid-cols-5 gap-4">
        {Object.entries(Brands).map(([brand, image]) => {
          return (
            <Image
              key={brand}
              src={image.src}
              alt={brand}
              width={image.width}
              height={image.height}
              unoptimized
              className="max-h-full max-w-full object-contain"
            />
          );
        })}
      </div>
    </div>
  );
}
