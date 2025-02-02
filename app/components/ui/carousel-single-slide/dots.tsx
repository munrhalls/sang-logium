import Logo from "@/public/icons/Logo.svg";
import Ellipse from "@/public/icons/Ellipse.svg";
import Image from "next/image";
interface CarouselDotsProps {
  keys: string[];
  currentIndex: number;
  onDotClick: (index: number) => void;
  multiSlide?: boolean;
}

export default function Dots({
  keys,
  currentIndex,
  onDotClick,
}: CarouselDotsProps) {
  const numberOfDots = keys.length;
  const [height, width] = numberOfDots > 10 ? [8, 8] : [16, 16];

  return (
    <div
      className={`z-40 h-full truncate text-white text-center sm:bg-transparent flex flex-shrink-0 justify-center items-center ${numberOfDots > 10 ? "gap-[0.25rem]" : "gap-2"} lg:gap-3 xl:gap-4 xl:mb-4`}
    >
      {keys.map((key, i) => {
        return (
          <div key={key + "_dot"}>
            <Image
              loading="lazy"
              src={Logo}
              height={height + 8}
              width={width + 8}
              alt={"Icon"}
              unoptimized
              onClick={() => onDotClick(i)}
              className={`${currentIndex === i ? "" : "hidden"}`}
            />
            <Image
              loading="lazy"
              key={key + "_dotempty"}
              src={Ellipse}
              height={height}
              width={width}
              alt={"Icon"}
              unoptimized
              onClick={() => onDotClick(i)}
              className={`cursor-pointer ${currentIndex === i ? "hidden" : ""}`}
            />
          </div>
        );
      })}
    </div>
  );
}
