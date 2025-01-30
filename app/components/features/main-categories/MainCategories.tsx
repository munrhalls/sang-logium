import Image from "next/image";
import LogoOrbit from "@/public/logo-orbit.svg";

export default function MainCategories() {
  return (
    <div className="h-full grid grid-cols-[1fr_5fr_1fr]">
      <div className="h-full pt-8 pb-4 col-start-2 col-end-3 flex justify-center items-center gap-4 gradient">
        <Image src={LogoOrbit} alt="Logo" width={80} height={80} unoptimized />
        <h1 className="text-black text-4xl">Main categories</h1>
      </div>
      <div className="h-full grid-cols-[2fr_3fr]">
        <div>time, months mvp product + graphic, description</div>
        <div>image</div>
      </div>
    </div>
  );
}
