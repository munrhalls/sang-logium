"use client";

import React from "react";
import { useState } from "react";
import Slide from "./slide";
import Dots from "./dots";
import Controls from "./controls";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";

type CarouselProps = {
  commercials: GET_COMMERCIALS_BY_FEATURE_QUERYResult;
};

const Carousel = ({ commercials }: CarouselProps) => {
  const [index, setIndex] = useState(0);

  if (!commercials) return null;

  const handleSlide = (direction: "left" | "right") => {
    const newIndex =
      direction === "left"
        ? (index - 1 + commercials.length) % commercials.length
        : (index + 1) % commercials.length;
    setIndex(newIndex);
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {commercials.map((commercial, i) => (
        <Slide key={i} commercial={commercial} index={i} currentIndex={index} />
      ))}

      <Controls onSlide={handleSlide} />
      <Dots
        commercials={commercials}
        currentIndex={index}
        onDotClick={setIndex}
      />
    </div>
  );
};

export default Carousel;
