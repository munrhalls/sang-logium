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
    <div className="h-full font-black text-xl grid place-content-center grid-rows-[2rem_3rem]">
      <div className="text-white text-center">Time left</div>
      <div className="grid place-content-center grid-cols-[3rem_3rem_3rem] gap-1 text-white">
        <div className="text-center">
          <div>{timeLeft.days}:</div>
          <div className="text-sm">days</div>
        </div>
        <div className="text-center">
          <div>{timeLeft.hours}:</div>
          <div className="text-sm">hours</div>
        </div>
        <div className="text-center">
          <div>{timeLeft.minutes}</div>
          <div className="text-sm">minutes</div>
        </div>
      </div>
    </div>
  );
};

const Title = function () {
  return (
    <div className="p-4 grid gap-2">
      <div className="flex gap-2">
        <Image
          src={LogoOrbitWhite}
          alt="Logo"
          height={24}
          width={24}
          loading="lazy"
        />
        <h1 className="text-2xl">Product of the month</h1>
      </div>
      <p>Produkt Dnia Smartfon APPLE iPhone 13 128GB Północ MLPF3PM/A</p>
    </div>
  );
};

const CTA = function () {
  return (
    <div className="h-full grid content-center items-center">
      <button className="bg-white text-black font-bold p-2 rounded-lg">
        Shop now
      </button>
    </div>
  );
};

export default function MonthProduct() {
  return (
    <div className="h-[800px] bg-black grid md:grid-cols-2">
      <div className="bg-orange-700 md:row-start-5 md:col-start-1 md:col-span-1">
        <TimeStamp />
      </div>
      <div className="bg-green-700 grid content-center justify-start 2xs:justify-center text-white row-start-4 md:row-start-4 md:col-start-1 md:col-span-2">
        <Title />
      </div>
      <div className="bg-yellow-700  row-start-5 grid place-content-center md:col-start-2 md:col-span-1">
        <CTA />
      </div>
      <div className="bg-blue-950 grid p-12 md:col-start-1 md:col-span-2">
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
