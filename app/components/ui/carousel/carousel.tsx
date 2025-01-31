"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import Dots from "./dots";
import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";

const Carousel = ({
  prebuiltSlides,
  keys,
}: {
  prebuiltSlides: JSX.Element[] | JSX.Element;
  keys: string[];
}) => {
  const [index, setIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSlideWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const count = keys.length;

  const handleSlide = (e: React.MouseEvent, direction: "left" | "right") => {
    e.preventDefault();
    e.stopPropagation();
    const newIndex =
      direction === "left" ? (index - 1 + count) % count : (index + 1) % count;
    setIndex(newIndex);
  };

  return (
    <div className="/*carousel*/ isolate h-full grid grid-rows-[1fr_3rem]">
      <div
        className="relative h-full w-full z-30 overflow-hidden"
        ref={containerRef}
      >
        <div
          className="h-full w-full flex transition-transform duration-300"
          style={{
            transform: `translateX(-${index * slideWidth}px)`,
          }}
        >
          {prebuiltSlides}
        </div>
      </div>
      <div className="z-50 h-full w-full bg-black grid grid-cols-[1fr_3fr_1fr]">
        <button
          type="button"
          onClick={(e) => handleSlide(e, "left")}
          className="z-50 relative  focus:outline-none bg-black pl-2 md:pl-6 flex items-center justify-center h-full w-full text-white"
        >
          <ChevronLeft />
        </button>

        <Dots
          keys={keys.map((item) => item + "dots")}
          currentIndex={index}
          onDotClick={(dotNum) => setIndex(dotNum)}
        />

        <button
          type="button"
          onClick={(e) => handleSlide(e, "right")}
          className="z-50 relative  focus:outline-none bg-black pr-2 md:pr-6 flex items-center justify-center h-full w-full text-white"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
