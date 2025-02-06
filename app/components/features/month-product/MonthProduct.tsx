"use client";
import { useEffect } from "react";
import { useState } from "react";
import LogoOrbitWhite from "@/public/logo-orbit-white.svg";
import Image from "next/image";

const TimeStamp = function () {
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      lastDay.setHours(23, 59, 59, 999);

      const total = lastDay.getTime() - now.getTime();

      if (total < 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00" });
        return;
      }

      const days = String(Math.floor(total / (1000 * 60 * 60 * 24))).padStart(
        2,
        "0"
      );
      const hours = String(
        Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      ).padStart(2, "0");
      const minutes = String(
        Math.floor((total % (1000 * 60 * 60)) / (1000 * 60))
      ).padStart(2, "0");

      setTimeLeft({ days, hours, minutes });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer);
  }, []);

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
  });

  return (
    <div className="h-full font-black text-xl">
      <div className="grid place-content-center md:place-content-start grid-cols-[3rem_3rem_3rem] gap-1 text-white">
        <div className="text-white col-start-1 col-span-3">Time left</div>
        <div className="text-start">
          <div>{timeLeft.days}:</div>
          <div className="text-sm">days</div>
        </div>
        <div className="text-start">
          <div>{timeLeft.hours}:</div>
          <div className="text-sm">hours</div>
        </div>
        <div className="text-start">
          <div>{timeLeft.minutes}</div>
          <div className="text-sm">minutes</div>
        </div>
      </div>
    </div>
  );
};

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

export default function MonthProduct() {
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

//  <div className="min-h-[800px] w-full  grid grid-rows-[5rem_4fr] bg-black">
//   <div className="h-full w-full grid grid-rows-[5rem_1fr] md:grid-rows-1 md:grid-cols-[1fr_2fr] gap-1">
//     <div className="h-full font-black text-xl grid  grid-rows-[2rem_3rem_3rem] md:place-content-center md:mb-4">
//       <div className="text-white text-center">Time left</div>
//       <div className="grid place-content-center grid-cols-[3rem_3rem_3rem] gap-1 text-white">
//         <div className="text-center">
//           <div>{timeLeft.days}:</div>
//           <div className="text-sm">days</div>
//         </div>
//         <div className="text-center">
//           <div>{timeLeft.hours}:</div>
//           <div className="text-sm">hours</div>
//         </div>
//         <div className="text-center">
//           <div>{timeLeft.minutes}</div>
//           <div className="text-sm">minutes</div>
//         </div>
//       </div>
//     </div>
//     <div className="h-full p-8 grid">
//       <div className="bg-white h-full grid place-content-center rounded-xl">
//          <ProductCard />
//       </div>
//     </div>
//   </div>
// </div>;
