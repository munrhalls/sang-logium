import Image from "next/image";
import LogoOrbit from "@/public/logo-orbit.svg";

export default async function MonthProduct() {
  return (
    <div className="h-full w-full bg-indigo-800 grid">
      <div className="h-full grid grid-cols-[1fr_4fr] place-items-center">
        <Image src={LogoOrbit} alt="Logo" width={60} height={60} unoptimized />
        <h1 className="text-black font-black text-3xl">MVP of the month</h1>
      </div>
      <div className="h-full w-full bg-indigo-800 grid">
        <div>time, months mvp product + graphic, description</div>
        <div>image</div>
      </div>
    </div>
  );
}
