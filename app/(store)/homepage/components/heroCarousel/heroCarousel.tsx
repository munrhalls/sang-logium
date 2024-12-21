"use client";

import { MarketingSlide } from "@/sanity.types";
import Slide from "./slide";

import { useState } from "react";
import Image from "next/image";
import imageUrl from "@/lib/imageUrl";
import { Sale } from "@/sanity.types";
import Link from "next/link";
import TextOverlay from "./textOverlay";
import Logo from "../../../../../public/icons/Logo.svg";
import Ellipse from "../../../../../public/icons/Ellipse.svg";
import ChevronLeft from "../../../../../public/icons/ChevronLeft.svg";
import ChevronRight from "../../../../../public/icons/ChevronRight.svg";

export default function HeroCarousel({ slides }: { slide: MarketingSlide[] }) {
  const [index, setIndex] = useState(0);

  const handleSlide = (direction: "left" | "right") => {
    const newIndex =
      direction === "left"
        ? (index - 1 + slidesArr.length) % slidesArr.length
        : (index + 1) % slidesArr.length;
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

  // const ctaBtn = (
  //   <div
  //     style={{
  //       backgroundColor: "#CF8226",
  //       border: "1px solid #fff",
  //     }}
  //     className="mt-auto rounded-sm flex flex-col justify-center items-center h-12 w-32"
  //   >
  //     <Link
  //       className="text-white text-xl font-black text-center block"
  //       href={`categories/sale/${onSale.slug.current}`}
  //     >
  //       <span>SEE more</span>
  //     </Link>
  //   </div>
  // );

  // const cta = christmasSale?.slug ? (
  //   <div
  //     style={{
  //       backgroundColor: "#CF8226",
  //       border: "1px solid #fff",
  //     }}
  //     className="mt-auto rounded-sm flex flex-col justify-center items-center h-12 w-32"
  //   >
  //     <Link
  //       className="text-white text-xl font-black text-center block"
  //       href={`categories/sale/${christmasSale.slug.current}`}
  //     >
  //       <span>SEE NOW</span>
  //     </Link>
  //   </div>
  // ) : null;

  // const title = (
  //   <h1 className="text-xl">
  //     Christmas <span style={{ color: "#CF8226" }}>GIFTS!</span>
  //   </h1>
  // );

  // const subtitle = (
  //   <p className="mt-2 text-xs pr-[50%]">
  //     <span style={{ color: "#CF8226" }}>ALL</span> WIRELESS HEADPHONES {""}
  //   </p>
  // );

  // const percentOff = (
  //   <p className="mt-2 text-2xl">
  //     <span style={{ color: "#CF8226" }}>-25%! </span>
  //   </p>
  // );

  // const textOverlay = christmasSale ? (
  //   <div className="p-4 absolute inset-0 right-[20%] flex flex-col justify-start font-black text-white scale-[1.0] 2xs:inset-[10%] 2xs:right-[30%] 2xs:scale-[1.2] sm:inset-[20%] sm:scale-[1.5] md:inset-[25%] md:scale-[1.8] lg:inset-[30%] lg:scale-[2.0] xl:inset-[32.5%] xl:scale-[2.5] 2xl:inset-[35%] 2xl:scale-[2.75] 3xl:inset-[37.5%] 3xl:scale-[3.5]">
  //     {title}
  //     {subtitle}
  //     {percentOff}
  //     {cta}
  //   </div>
  // ) : null;

  // const christmasSaleSlide = christmasSale?.image ? (
  //   <div className={`absolute inset-0 rounded z-40`}>
  //     {/* // TODO - heroSlider */}
  //     <Image
  //       src={imageUrl(christmasSale.image).url()}
  //       fill
  //       sizes="100vw"
  //       className="object-cover object-[90%_0%] md:object-[30%_40%]"
  //       alt="Christmas Sale"
  //       priority
  //     />
  //     {textOverlay}
  //   </div>
  // ) : null;

  // const onSaleSlide = onSale?.image ? (
  //   <div className={`absolute inset-0 rounded z-40`}>
  //     <Image
  //       src={imageUrl(onSale.image).url()}
  //       fill
  //       sizes="100vw"
  //       className="object-cover object-[0%_0%] md:object-[100%_20%]"
  //       alt="On Sale"
  //       priority
  //     />

  //     <div className="p-4 absolute inset-0 right-[0%] flex flex-col justify-start font-black text-white scale-[1.0] 2xs:inset-[10%] 2xs:right-[0%] 2xs:scale-[1.2] sm:inset-[20%] sm:scale-[1.5] md:inset-[25%] md:scale-[1.8] lg:inset-[30%] lg:scale-[2.0] xl:inset-[32.5%] xl:scale-[2.5] 2xl:inset-[35%] 2xl:scale-[2.75] 3xl:inset-[37.5%] 3xl:scale-[3.5]">
  //       <div>
  //         <div
  //           style={{
  //             backgroundColor: "#CF8226",
  //             border: "1px solid #fff",
  //           }}
  //           className="z-50 mt-auto rounded-sm flex flex-col justify-center items-center h-12 w-32"
  //         >
  //           <Link
  //             className="text-white text-xl font-black text-center block"
  //             href={`categories/sale/${onSale?.slug?.current}`}
  //           >
  //             <span>SEE MORE</span>
  //           </Link>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // ) : null;

  // const slide3 = (
  //   <div className="bg-zinc-700 absolute inset-0 text-white text-7xl flex justify-center items-center">
  //     3
  //   </div>
  // );

  const slidesArr = [1, 2, 3];

  return (
    <div className="relative h-full w-full overflow-hidden font-oswald">
      {/* TODO - hero slide refactor */}
      {slidesArr.map((slide, i) => {
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
            <Slide />
          </div>
        );
      })}

      {/* //TODO - heroControls refactor */}
      {btnSlideLeft}
      {btnSlideRight}
      <div className="z-50 absolute left-0 right-0 bottom-1 flex flex-shrink-0 justify-center items-center gap-2">
        {slidesArr.map((_, i) => {
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
