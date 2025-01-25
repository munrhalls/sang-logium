import Image from "next/image";
import LogoOrbit from "@/public/logo-orbit.svg";

export default async function Bestsellers() {
  return (
    <div className="h-full grid grid-cols-[1fr_5fr_1fr]">
      <div className="h-full pt-8 pb-4 col-start-2 col-end-3 flex justify-center items-center gap-4 gradient">
        <Image src={LogoOrbit} alt="Logo" width={80} height={80} unoptimized />
        <h1 className="text-black text-4xl">Bestsellers</h1>
      </div>
      <div className="h-full col-start-2 col-end-3">
        <div>product bestseller</div>
        <div>product bestseller</div>
        <div>product bestseller</div>
        <div>product bestseller</div>

        <div>product bestseller</div>
        <div>product bestseller</div>
        <div>product bestseller</div>
        <div>product bestseller</div>
        <div>product bestseller</div>

        <div>product bestseller</div>
        <div>product bestseller</div>
        <div>product bestseller</div>
        <div>product bestseller</div>
        <div>product bestseller</div>

        <div>product bestseller</div>
      </div>
    </div>
  );
}
