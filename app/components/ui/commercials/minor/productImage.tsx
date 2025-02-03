import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";

export default function ProductImage({
  src,
  brand,
}: {
  src: string;
  brand: string;
}) {
  return (
    <div className="h-full w-full relative mx-auto">
      <Image
        loading="lazy"
        decoding="async"
        quality={100}
        sizes="(max-width: 768px) 36vw, 25vw"
        src={imageUrl(src).url()}
        alt={brand}
        height={60}
        width={60}
        className="z-40 h-full w-full absolute inset-0 aspect-square object-contain rounded-sm"
      />
    </div>
  );
}
