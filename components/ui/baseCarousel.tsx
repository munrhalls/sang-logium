"use client";

import React from "react";
import { useState } from "react";
import { Commercial } from "@/sanity.types";
import Image from "next/image";
import Logo from "../../public/icons/Logo.svg";
import Ellipse from "../../public/icons/Ellipse.svg";
import ChevronLeft from "../../public/icons/ChevronLeft.svg";
import ChevronRight from "../../public/icons/ChevronRight.svg";
import BaseSlide from "./baseSlide";

interface BaseControlsProps {
  onSlide: (direction: "left" | "right") => void;
}
function BaseControls({ onSlide }: BaseControlsProps) {
  return (
    <>
      <button
        onClick={() => onSlide("left")}
        className="z-50 text-white text-3xl absolute left-0 top-0 bottom-0"
      >
        <Image src={ChevronLeft} alt="Chevron Left" />
      </button>
      <button
        onClick={() => onSlide("right")}
        className="z-50 text-white text-3xl absolute top-0 bottom-0 right-0"
      >
        <Image src={ChevronRight} alt="Chevron Right" />
      </button>
    </>
  );
}

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

  const btnSlideLeft = (
    <button
      onClick={() => handleSlide("left")}
      className="z-50 text-white text-3xl absolute left-0 top-0 bottom-0"
    >
      <Image src={ChevronLeft} alt="Chevron Left" />
    </button>
  );

  const btnSlideRight = (
    <button
      onClick={() => handleSlide("right")}
      className="z-50 text-white text-3xl absolute top-0 bottom-0 right-0"
    >
      <Image src={ChevronRight} alt="Chevron Right" />
    </button>
  );

  return (
    <div className="relative h-full w-full overflow-hidden font-oswald">
      {/* TODO - hero slide refactor */}
      {slides.map((slide, i: number) => {
        return (
          <div
            key={i}
            className="absolute top-0 bottom-0 transition-transform duration-450 ease-in-out will-change-transform"
            style={{
              height: "100%",
              width: "100%",
              left: `${i * 100}%`,
              right: `${(i + 1) * 100}%`,
              transform: `translateX(-${index * 100}%)`,
            }}
          >
            <BaseSlide slide={slide} />
          </div>
        );
      })}

      {/* //TODO - heroControls refactor */}
      {/* {btnSlideLeft}
      {btnSlideRight} */}
      <BaseControls onSlide={handleSlide} />
      <div className="z-50 absolute left-0 right-0 bottom-1 flex flex-shrink-0 justify-center items-center gap-2">
        {slides.map((_, i) => {
          return (
            <Image
              key={i}
              src={index === i ? Logo : Ellipse}
              alt={index === i ? "Logo" : "Ellipse"}
              className={`transition-all duration-450 ${index === i ? "cursor-default h-6 w-6" : "cursor-pointer h-4 w-4"}`}
              onClick={() => setIndex(i)}
            />
          );
        })}
      </div>
    </div>
  );
}
