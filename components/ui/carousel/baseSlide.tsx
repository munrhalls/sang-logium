import { Commercial } from "@/sanity.types";
import Image from "next/image";
import imageUrl from "@/lib/imageUrl";

interface BaseSlideProps {
  slide: Commercial;
  index: number;
  currentIndex: number;
}

export default function BaseSlide({
  slide,
  index,
  currentIndex,
}: BaseSlideProps) {
  if (!slide.image) return null;

  return (
    <div
      className="absolute top-0 bottom-0 transition-transform duration-450 ease-in-out will-change-transform"
      style={{
        height: "100%",
        width: "100%",
        left: `${index * 100}%`,
        right: `${(index + 1) * 100}%`,
        transform: `translateX(-${currentIndex * 100}%)`,
      }}
    >
      <div className="absolute inset-0 rounded z-40">
        <Image
          src={imageUrl(slide.image).url()}
          fill
          sizes="100vw"
          className="object-cover object-[90%_0%] md:object-[30%_40%]"
          alt={slide.title || "Sale"}
          priority
        />
      </div>
    </div>
  );
}
