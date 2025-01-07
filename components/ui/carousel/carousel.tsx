"use client";

import React from "react";
import { useState } from "react";
import BaseSlide from "./slide";
import Dots from "./dots";
import BaseControls from "./controls";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "../../../sanity.types";

const Carousel = ({
  commercials,
}: {
  commercials: GET_COMMERCIALS_BY_FEATURE_QUERYResult;
}) => {
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
        <BaseSlide
          key={i}
          commercial={commercial}
          index={i}
          currentIndex={index}
        />
      ))}

      <BaseControls onSlide={handleSlide} />
      <Dots
        commercials={commercials}
        currentIndex={index}
        onDotClick={setIndex}
      />
    </div>
  );
};

export default Carousel;
