"use client";

import React from "react";
import { useState } from "react";
import Slide from "./slide";
import Dots from "./dots";
import Controls from "./controls";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";

type CarouselProps = {
  commercials: NonNullable<GET_COMMERCIALS_BY_FEATURE_QUERYResult>;
};

const Carousel = ({ commercials }: CarouselProps) => {
  const [index, setIndex] = useState(0);

  const handleSlide = (direction: "left" | "right") => {
    const newIndex =
      direction === "left"
        ? (index - 1 + commercials.length) % commercials.length
        : (index + 1) % commercials.length;
    setIndex(newIndex);
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className=" h-full transform duration-300"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {commercials.map(
          (commercial, i) =>
            Math.abs(i - index) <= 1 && (
              <Slide
                key={commercial._id}
                commercial={commercial}
                index={i}
                currentIndex={index}
              />
            )
        )}
      </div>
      <Controls onSlide={handleSlide} />
      <Dots
        keys={commercials.map((c) => c._id + "dots")}
        currentIndex={index}
        onDotClick={setIndex}
      />
    </div>
  );
};

export default Carousel;
