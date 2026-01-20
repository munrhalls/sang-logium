import Image from "next/image";

export default function PromotionImage({
  src,
  headline,
}: {
  src: string;
  headline: string;
}) {
  return (
    <Image
      src={src}
      alt={headline}
      fill
      priority
      quality={95}
      sizes="(max-width: 768px) 100vw, 100vw"
      style={{ objectFit: "cover" }}
    />
  );
}
