import ChevronLeft from "@/public/icons/ChevronLeft.svg";
import ChevronRight from "@/public/icons/ChevronRight.svg";
interface BaseControlsProps {
  onSlide: (direction: "left" | "right") => void;
}
export default function Controls({ onSlide }: BaseControlsProps) {
  return (
    <>
      <button
        onClick={() => onSlide("left")}
        className="max-h-full z-50 col-start-1 text-white text-3xl "
      >
        <ChevronLeft />
      </button>

      <button
        onClick={() => onSlide("right")}
        className="max-h-full z-50 col-start-3  text-white text-3xl lg:top-0"
      >
        <ChevronRight />
      </button>
    </>
  );
}
