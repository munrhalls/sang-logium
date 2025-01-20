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
        <ChevronLeft />
      </button>

      <button
        onClick={() => onSlide("right")}
        className="z-50  text-white text-3xl absolute bottom-1 lg:bottom-12 right-0 lg:top-0"
      >
        <ChevronRight />
      </button>
    </>
  );
}
