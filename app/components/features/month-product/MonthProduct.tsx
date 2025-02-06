import LogoOrbitWhite from "@/public/logo-orbit-white.svg";
import Image from "next/image";
import TimeStamp from "./TimeStamp";

const Title = function () {
  return (
    <div className="lg:p-0">
      <div className="flex gap-1">
        <Image
          src={LogoOrbitWhite}
          alt="Logo"
          height={32}
          width={32}
          loading="lazy"
        />
        <h1 className="text-2xl sm:text-3xl">Product of the month</h1>
      </div>
      <p className="mt-1 lg:max-w-[400px]">
        Produkt Dnia Smartfon APPLE iPhone 13 128GB&nbsp;Północ&nbsp;MLPF3PM/A
      </p>
    </div>
  );
};

const CTA = function () {
  return (
    <div className="h-full max-w-40">
      <button className="bg-white text-black font-bold p-2 rounded-lg">
        Shop now
      </button>
    </div>
  );
};

export default async function MonthProduct() {
  return (
    <div className="h-[800px] py-8 md:h-[600px] lg:h-[500px] bg-black grid md:grid-cols-4 lg:p-12 lg:grid-cols-8 lg:grid-rows-3 lg:gap-1">
      <div className="md:col-start-2 md:col-span-1 md:grid md:justify-start md:row-start-3 lg:col-start-2 lg:row-start-1 lg:row-span-1">
        <TimeStamp />
      </div>
      <div className=" grid p-6 content-center justify-start 2xs:justify-center text-white row-start-3 md:p-0 md:row-start-2 md:col-start-2 md:col-span-2 md:grid md:justify-start lg:content-start lg:p-0 lg:col-start-2 lg:col-span-3 lg:row-start-2">
        <Title />
      </div>
      <div className="grid place-content-center  l row-start-4 md:row-start-3 md:col-start-3 md:col-span-1 md:grid md:place-content-center lg:col-start-2  lg:row-start-3 lg:justify-start ">
        <CTA />
      </div>
      <div className="grid p-6  lg:py-6 md:p-0 md:col-start-1 md:col-span-4 lg:col-start-5 lg:row-start-1 lg:row-span-3 xl:col-start-4 xl:col-span-4">
        <div className="bg-white rounded-xl min-h-[300px]"></div>
      </div>
    </div>
  );
}
