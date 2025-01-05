"use client";

import React from "react";
import { useState } from "react";
import BaseSlide from "./baseSlide";
import CarouselDots from "./baseDots";
import BaseControls from "./baseControls";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "../../../sanity.types";

const BaseCarousel = ({
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

  const visibleCommercials = commercials.slice(
    Math.max(0, index - 1),
    Math.min(commercials.length, index + 2)
  );

  return (
    <div className="relative h-full w-full overflow-hidden font-oswald">
      {visibleCommercials.map((commercial, i) => (
        <BaseSlide
          key={i}
          commercial={commercial}
          index={i}
          currentIndex={index}
        />
      ))}

      <BaseControls onSlide={handleSlide} />
      <CarouselDots
        commercials={commercials}
        currentIndex={index}
        onDotClick={setIndex}
      />
    </div>
  );
};

export default BaseCarousel;
