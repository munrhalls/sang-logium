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
  prebuiltSlides: JSX.Element[] | JSX.Element;
  multiplePerScreen?: boolean;
  keys: string[];
}) => {
  const [index, setIndex] = useState(0);

  const count = keys.length;

  const handleSlide = (direction: "left" | "right") => {
    const newIndex =
      direction === "left" ? (index - 1 + count) % count : (index + 1) % count;
    setIndex(newIndex);
  };

  return (
    <div className="/*carousel*/ h-full grid grid-rows-[1fr_3rem]">
      <div className="relative h-full w-full z-30 overflow-hidden">
        <style>{`
        :root {
          --slide-width: 100%;
        }
        @media (min-width: 640px) {
          :root {
            --slide-width: 50%;
          }
        }
        @media (min-width: 768px) {
          :root {
            --slide-width: 33.333%;
          }
        }
      `}</style>

        <div
          className={`relative h-full w-full flex transform duration-300 will-change-transform`}
          style={{
            transform: `translateX(-${index * 100}%)`,
            backfaceVisibility: "hidden",
          }}
        >
          {prebuiltSlides}
        </div>
      </div>
      <div className="z-50 h-full w-full bg-black grid grid-cols-[1fr_3fr_1fr]">
        <button
          onClick={() => handleSlide("left")}
          className="z-50 focus:outline-none bg-black pl-2 md:pl-6 flex items-center justify-center h-full w-full text-white"
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
          className="z-50 focus:outline-none bg-black pr-2 md:pr-6 flex items-center justify-center h-full w-full text-white"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
