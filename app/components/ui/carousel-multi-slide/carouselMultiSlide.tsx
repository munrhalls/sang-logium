"use client";

import React, { useState } from "react";
import MultiDots from "./multiDots";
import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";

const CarouselMultiSlide = ({
  prebuiltSlides,
  keys,
}: {
  prebuiltSlides: JSX.Element[];
  keys: string[];
}) => {
  const [index, setIndex] = useState(0);
  const handleSetIndex = (newIndex: number) => {
    setIndex(newIndex);
  };

  const count = keys.length;

  const handleSlide = (direction: "left" | "right") => {
    const newIndex =
      direction === "left" ? (index - 1 + count) % count : (index + 1) % count;

    handleSetIndex(newIndex);
  };

  return (
    <div className="isolate relative h-full grid grid-rows-[1fr_3rem] px-[48px]">
      <div className="relative h-full w-full z-30 overflow-hidden ">
        <div
          className="carousel-multislide-track h-full w-full flex transition-transform duration-300"
          style={{
            transform: `translateX(calc(-${index} * var(--slide-width)))`,
          }}
        >
          {prebuiltSlides.map((slide, index) => (
            <div
              className="carousel-multislide-slide"
              key={keys[index] + "_slide"}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => handleSlide("left")}
        className="z-50 absolute top-[40%] left-0  focus:outline-none flex items-center justify-center text-black hover:text-orange-500 transition-colors duration-300"
      >
        <ChevronLeft size={48} />
      </button>
      <button
        type="button"
        onClick={() => handleSlide("right")}
        className="z-50 absolute top-[40%] right-0  focus:outline-none flex items-center justify-center text-black hover:text-orange-500 transition-colors duration-300"
      >
        <ChevronRight size={48} />
      </button>
      <div className="z-50 h-full w-full ">
        <MultiDots
          keys={keys.map((item) => item + "dots")}
          currentIndex={index}
          onDotClick={(dotNum) => handleSetIndex(dotNum)}
        />
      </div>
    </div>
  );
};

export default CarouselMultiSlide;
