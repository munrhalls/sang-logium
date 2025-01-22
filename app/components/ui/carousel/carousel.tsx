"use client";

import React from "react";
import { useState } from "react";
import Dots from "./dots";
import Controls from "./controls";

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
    <div className="relative h-full w-full overflow-hidden grid-rows-[1fr_2rem]">
      <div
        className="h-full transform duration-300"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {prebuiltSlides}
      </div>
      <div className="bg-purple-900 z-50 grid grid-cols-3">
        <Controls onSlide={handleSlide} />
        <Dots
          keys={keys.map((item) => item + "dots")}
          currentIndex={index}
          onDotClick={(dotNum) => setIndex(dotNum)}
        />
      </div>
    </div>
  );
};

export default Carousel;
