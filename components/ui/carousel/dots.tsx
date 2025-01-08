import Image from "next/image";
import Logo from "../../../public/icons/Logo.svg";
import Ellipse from "../../../public/icons/Ellipse.svg";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";

interface CarouselDotsProps {
  commercials: GET_COMMERCIALS_BY_FEATURE_QUERYResult;
  currentIndex: number;
  onDotClick: (index: number) => void;
}

export default function Dots({
  commercials,
  currentIndex,
  onDotClick,
}: CarouselDotsProps) {
  return (
    <div className="z-50 absolute left-0 right-0 bottom-1 flex flex-shrink-0 justify-center items-center gap-2 xl:mb-4">
      {commercials.map((_, i) => (
        <Image
          loading="lazy"
          quality={85}
          key={i}
          src={currentIndex === i ? Logo : Ellipse}
          height={48}
          width={48}
          alt={"Icon"}
          className={`transition-all duration-450 ${currentIndex === i ? "cursor-default h-6 w-6 xl:h-12 xl:w-12 " : "cursor-pointer h-4 w-4"}`}
          onClick={() => onDotClick(i)}
        />
      ))}
    </div>
  );
}
