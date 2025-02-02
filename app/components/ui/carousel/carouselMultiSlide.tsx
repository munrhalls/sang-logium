"use client";

import React, { useState } from "react";
import Dots from "./dots";
import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";

const CarouselMultiSlide = ({
  prebuiltSlides,
  responsive = false,
  keys,
}: {
  prebuiltSlides: JSX.Element[];
  responsive?: boolean;
  keys: string[];
}) => {
  const [index, setIndex] = useState(0);
  const handleSetIndex = (newIndex: number) => {
    if (viewportSize && sizesIndexOffsets[viewportSize] + newIndex >= count) {
      return;
    }

    setIndex(newIndex);
  };

  const viewportSize = responsive
    ? window.matchMedia("(min-width: 1280px)").matches
      ? "xl"
      : window.matchMedia("(min-width: 1024px)").matches
        ? "lg"
        : window.matchMedia("(min-width: 768px)").matches
          ? "md"
          : window.matchMedia("(min-width: 640px)").matches
            ? "sm"
            : "xs"
    : null;

  const sizes = viewportSize
    ? {
        xs: 100,
        sm: 50,
        md: 33.3333,
        lg: 25,
        xl: 20,
      }
    : 100;

  const sizesIndexOffsets = {
    xs: 0,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
  };

  const slideBy =
    responsive && viewportSize
      ? (sizes as { [key: string]: number })[viewportSize]
      : 100;

  const count = keys.length;

  const handleSlide = (direction: "left" | "right") => {
    const newIndex =
      direction === "left" ? (index - 1 + count) % count : (index + 1) % count;

    handleSetIndex(newIndex);
  };

  return (
    <div className="/*carousel*/ isolate relative h-full grid grid-rows-[1fr_3rem] px-[48px]">
      <div className="relative h-full w-full z-30 overflow-hidden ">
        <div
          className="h-full w-full flex transition-transform duration-300"
          style={{
            transform: `translate3d(-${index * slideBy}%, 0, 0)`,
          }}
        >
          {prebuiltSlides.map((slide, index) => (
            <div
              className={`flex-[0_0_100%] ${responsive ? "sm:flex-[0_0_50%] md:flex-[0_0_33.3334%] lg:flex-[0_0_25%] xl:flex-[0_0_20%]" : ""}`}
              key={keys[index] + "_prebuiltSlides"}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => handleSlide("left")}
        className="z-50 absolute top-[40%] left-0 focus:outline-none pl-2 md:pl-6 flex items-center justify-center text-black"
      >
        <ChevronLeft />
      </button>
      <button
        type="button"
        onClick={() => handleSlide("right")}
        className="z-50 absolute top-[40%] right-0 focus:outline-none  pr-2 md:pr-6 flex items-center justify-center text-black"
      >
        <ChevronRight />
      </button>
      <div className="z-50 h-full w-full bg-slate-600">
        <Dots
          keys={keys.map((item) => item + "dots")}
          currentIndex={index}
          onDotClick={(dotNum) => handleSetIndex(dotNum)}
        />
      </div>
    </div>
  );
};

export default CarouselMultiSlide;
