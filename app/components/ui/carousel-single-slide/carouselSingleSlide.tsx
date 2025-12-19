// TODO skip Next.js's internal image optimization (which burns server CPU) and use Sanity's CDN directly, while keeping next/image features (layout, priority, lazy loading)
// TODO FOR ALL IMAGES ACTUALLY
// TODO make custon SANITY LOADER export default function sanityLoader({ src, width, quality }) {
//   return `${src}?w=${width}&q=${quality || 75}&auto=format`
// }
"use client";
import React, { useState } from "react";
import Dots from "./dots";
import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";
const CarouselSingleSlide = ({
  prebuiltSlides,
  keys,
}: {
  prebuiltSlides: JSX.Element[];
  keys: string[];
}) => {
  const [index, setIndex] = useState(0);
  const handleSetIndex = (newIndex: number) => {
    setIndex(newIndex);
  };
  const count = keys.length;
  const handleSlide = (direction: "left" | "right") => {
    const newIndex =
      direction === "left" ? (index - 1 + count) % count : (index + 1) % count;
    handleSetIndex(newIndex);
  };
  return (
    <div className="relative isolate grid h-full grid-rows-[1fr_3rem]">
      <div className="relative z-30 h-full w-full overflow-hidden">
        <div
          className="flex h-full w-full transition-transform duration-300"
          style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
        >
          {prebuiltSlides.map((slide, slideIndex) => (
            <div
              className="flex-[0_0_100%]"
              key={keys[slideIndex] + "_prebuiltSlides"}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
      <div className="z-50 grid h-full w-full grid-cols-[1fr_3fr_1fr] bg-black">
        <button
          type="button"
          onClick={() => handleSlide("left")}
          className="relative z-50 flex h-full w-full items-center justify-center bg-black pl-2 text-white focus:outline-none md:pl-6"
        >
          <ChevronLeft />
        </button>
        <Dots
          keys={keys.map((item) => item + "dots")}
          currentIndex={index}
          onDotClick={(dotNum) => handleSetIndex(dotNum)}
        />
        <button
          type="button"
          onClick={() => handleSlide("right")}
          className="relative z-50 flex h-full w-full items-center justify-center bg-black pr-2 text-white focus:outline-none md:pr-6"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
export default CarouselSingleSlide;
