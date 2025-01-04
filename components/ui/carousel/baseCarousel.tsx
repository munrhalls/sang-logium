"use client";

import React from "react";
import { useState } from "react";
import { Commercial } from "@/sanity.types";

import BaseSlide from "./baseSlide";
import CarouselDots from "./baseDots";
import BaseControls from "./baseControls";

interface CarouselProps {
  slides: Commercial[];
}

export default function BaseCarousel({ slides }: CarouselProps) {
  const [index, setIndex] = useState(0);

  if (!slides) return null;

  const handleSlide = (direction: "left" | "right") => {
    const newIndex =
      direction === "left"
        ? (index - 1 + slides.length) % slides.length
        : (index + 1) % slides.length;
    setIndex(newIndex);
  };

  return (
    <div className="relative h-full w-full overflow-hidden font-oswald">
      {slides.map((slide, i) => (
        <BaseSlide key={i} slide={slide} index={i} currentIndex={index} />
      ))}

      <BaseControls onSlide={handleSlide} />
      <CarouselDots
        slides={slides}
        currentIndex={index}
        onDotClick={setIndex}
      />
    </div>
  );
}
