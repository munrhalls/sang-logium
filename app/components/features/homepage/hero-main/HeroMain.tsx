import Image from "next/image";
import TextCommercialWrapper from "./TextCommercialWrapper";
export default async function HeroMain() {
  return (
    <div className="relative grid h-full grid-rows-[1fr_3rem]">
      <div className="relative z-30 h-full w-full overflow-hidden">
        <div className="relative h-full flex-[0_0_100%]">
          <Image
            src={"/HeroMain.webp"}
            priority
            fetchPriority="high"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1920px"
            style={{ objectFit: "cover", objectPosition: "right" }}
            className="hero-image"
            quality={95}
            alt="Sang logium Hero image"
          />
          <TextCommercialWrapper />
        </div>
      </div>
      <div className="z-30 h-full w-full bg-black">
        <p className="flex h-full items-center justify-center text-xs font-black tracking-wide text-white sm:text-sm lg:text-lg lg:tracking-wider">
          Offer available only until November 30th!
        </p>
      </div>
    </div>
  );
}
