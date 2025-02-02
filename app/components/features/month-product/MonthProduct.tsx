"use client";
import SegmentTitle from "../../ui/segment-title/SegmentTitle";
import { useEffect } from "react";
import { useState } from "react";

export default function MonthProduct() {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
  });

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

  return (
    <div className="h-full w-full  grid grid-rows-[5rem_4fr]">
      <SegmentTitle title="MVP of the month!" />
      <div className="h-full w-full  grid grid-rows-[5rem_1fr] md:grid-rows-1 md:grid-cols-[1fr_2fr] gap-1">
        <div className="h-full font-black text-xl grid  grid-rows-[2rem_3rem] md:place-content-center md:mb-4">
          <div className="text-white text-center">Time left</div>
          <div className="grid place-content-center grid-cols-[3rem_3rem_3rem] gap-1">
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
        <div className="bg-green-300 h-full p-8 grid">
          <div className="bg-white h-full grid place-content-center rounded-xl">
            <span>product</span>
          </div>
        </div>
      </div>
    </div>
  );
}
