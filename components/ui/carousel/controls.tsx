import Image from "next/image";
import ChevronLeft from "../../../public/icons/ChevronLeft.svg";
import ChevronRight from "../../../public/icons/ChevronRight.svg";
interface BaseControlsProps {
  onSlide: (direction: "left" | "right") => void;
}
export default function Controls({ onSlide }: BaseControlsProps) {
  return (
    <>
      <button
        onClick={() => onSlide("left")}
        className="z-50 bg-black/20 text-white text-3xl absolute left-0  bottom-1"
      >
        <Image
          loading="lazy"
          quality={75}
          width={48}
          height={48}
          className="w-9 md:w-16 lg:w-24 xl:w-32"
          src={ChevronLeft}
          alt="Chevron Left"
        />
      </button>
      <button
        onClick={() => onSlide("right")}
        className="z-50 bg-black/20 text-white text-3xl absolute bottom-1 right-0"
      >
        <Image
          loading="lazy"
          quality={75}
          width={48}
          height={48}
          className="w-9 md:w-16 lg:w-24 xl:w-32"
          src={ChevronRight}
          alt="Chevron Right"
        />
      </button>
    </>
  );
}
