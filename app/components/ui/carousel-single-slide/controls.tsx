TODO Fix very suboptimal controls for carousel single slide
// . Interactive Menu Button Optimization
// You mentioned menu buttons using logos. If these are "Brand Logos" inside the carousel (e.g., "As seen in..."):

// Format: Do not use next/image for tiny logos if they are vector. Use SVG strings stored in Sanity (inline SVG) or standard <img> tags for SVGs.

// Sanity Field: Use a logo field type that restricts uploads to .svg or .png.

// Optimization: If they are PNGs, use the same sanityLoader but request a fixed small width (e.g., ?w=100) to ensure you don't download a 4MB logo for a 50px icon.

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
