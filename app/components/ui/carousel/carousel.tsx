"use client";

import React from "react";
import { useState } from "react";
import Dots from "./dots";
// import Controls from "./controls";
import ChevronLeft from "@/public/icons/ChevronLeft.svg";
import ChevronRight from "@/public/icons/ChevronRight.svg";

const Carousel = ({
  prebuiltSlides,
  keys,
}: {
  prebuiltSlides: JSX.Element[];
  keys: string[];
}) => {
  const [index, setIndex] = useState(0);
  console.log(index);
  const count = keys.length;
  const handleSlide = (direction: "left" | "right") => {
    const newIndex =
      direction === "left" ? (index - 1 + count) % count : (index + 1) % count;
    setIndex(newIndex);
  };

  return (
    <div className="h-full w-full grid grid-rows-[1fr_2rem]">
      <div
        className="relative  overflow-hidden bg-slate-500 transform duration-300"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {prebuiltSlides}
      </div>
      <div className="z-50 bg-black grid grid-cols-3">
        {/* <Controls onSlide={handleSlide} /> */}
        <button
          onClick={() => handleSlide("left")}
          className=" inline h-full z-50 col-start-1 place-content-center text-white text-3xl "
        >
          <ChevronLeft />
        </button>
        <Dots
          keys={keys.map((item) => item + "dots")}
          currentIndex={index}
          onDotClick={(dotNum) => setIndex(dotNum)}
        />
        {/* <button
          onClick={() => handleSlide("right")}
          className="max-h-full z-50 text-center col-start-3 grid place-content-center  text-white text-3xl lg:top-0"
        >
          <ChevronRight />
        </button> */}
      </div>
    </div>
  );
};

export default Carousel;
