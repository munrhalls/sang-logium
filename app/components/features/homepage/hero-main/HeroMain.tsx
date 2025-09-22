import Image from "next/image";
import { getCommercialsHeroMain } from "@/sanity/lib/commercials/getCommercialsHeroMain";

export default async function HeroMain() {
  const imageSrc = await getCommercialsHeroMain();

  return (
    <div className="isolate relative h-full grid grid-rows-[1fr_3rem]">
      <div className="relative h-full w-full z-30 overflow-hidden">
        <div className="h-full w-full flex">
          {/* <HeroCommercialItem /> */}
          <Image
            src={imageSrc}
            priority
            loading="eager"
            fetchPriority="high"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1920px"
            style={{ objectFit: "cover", objectPosition: "right" }}
            className={`absolute inset-0 w-full h-full object-cover hero-image`}
            quality={75}
            alt={""}
          />
        </div>
      </div>
      <div className="z-50 h-full w-full bg-black  grid grid-cols-[1fr_3fr_1fr]">
        <p className="text-white font-black tracking-wide">
          Offer available only until November 30th!
        </p>
      </div>
    </div>
  );
}
