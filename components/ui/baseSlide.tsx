import Image from "next/image";
import imageUrl from "@/lib/imageUrl";
import { Commercial } from "@/sanity.types";

export default function BaseSlide({ slide }: { slide: Commercial }) {
  if (!slide?.image) return null;

  return (
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
  );
}
