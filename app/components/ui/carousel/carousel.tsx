"use client";

import React from "react";
import { useState } from "react";
import Dots from "./dots";
import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";

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
    <div className="/* carousel */ h-full grid grid-rows-[1fr_2rem]">
      <div className="relative h-full w-full z-30 overflow-hidden">
        <div
          className="h-full flex transform duration-300 will-change-transform"
          style={{
            transform: `translateX(-${index * 100}%)`,
            backfaceVisibility: "hidden",
          }}
        >
          {prebuiltSlides}
        </div>
      </div>
      <div className="z-50 h-[2rem] w-full bg-black grid grid-cols-[auto_1fr_auto]">
        <button
          onClick={() => handleSlide("left")}
          className="z-50 bg-black ml-2 flex items-center justify-center h-full w-full text-white"
        >
          <ChevronLeft />
        </button>

        <Dots
          keys={keys.map((item) => item + "dots")}
          currentIndex={index}
          onDotClick={(dotNum) => setIndex(dotNum)}
        />

        <button
          onClick={() => handleSlide("right")}
          className="z-50 bg-black mr-2 flex items-center justify-center h-full w-full text-white"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
