import Image from "next/image";
import imageUrl from "@/lib/imageUrl";

type SlideInput = {
  backgroundImage?: unknown;
};

export default function Slide({ slide }: { slide: SlideInput }) {
  if (!slide?.backgroundImage) return null;

  return (
    <div className="absolute inset-0 rounded z-40">
      <Image
        src={imageUrl(slide.backgroundImage).url()}
        fill
        sizes="100vw"
        className="object-cover object-[90%_0%] md:object-[30%_40%]"
        alt="Christmas Sale"
        priority
      />
    </div>
  );
}
