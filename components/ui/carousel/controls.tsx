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
        className="z-50  text-white text-3xl absolute left-0 bottom-1 lg:bottom-12 lg:top-0"
      >
        {/* <Image
          unoptimized
          quality={50}
          width={48}
          height={48}
          className="w-9 sm:w-12 lg:w-16 xl:w-24 2xl:w-32 ml-2 sm:ml-4 xl:ml-6 2xl:ml-20 backdrop-brightness-50 rounded-full"
          src={ChevronLeft}
          alt="Chevron Left"
        /> */}

        <ChevronLeft />
      </button>
      <button
        onClick={() => onSlide("right")}
        className="z-50  text-white text-3xl absolute bottom-1 lg:bottom-12 right-0 lg:top-0"
      >
        {/* <Image
          unoptimized
          quality={50}
          width={48}
          height={48}
          className="w-9 sm:w-12 lg:w-16 xl:w-24 2xl:w-32 ml:r-2 sm:mr-4 xl:mr-6 backdrop-brightness-50 rounded-full"
          src={ChevronRight}
          alt="Chevron Right"
        /> */}
        <ChevronRight />
      </button>
    </>
  );
}
