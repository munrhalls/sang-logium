import Image from "next/image";
import TextCommercialWrapper from "./TextCommercialWrapper";

export default async function HeroMain() {
  return (
    <div className="relative h-full grid grid-rows-[1fr_3rem]">
      <div className="relative h-full w-full z-30 overflow-hidden">
        <div className=" h-full relative flex-[0_0_100%]">
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

      <div className="z-30 h-full w-full bg-black ">
        <p className="h-full text-xs sm:text-sm lg:text-lg text-white font-black tracking-wide lg:tracking-wider flex items-center justify-center">
          Offer available only until November 30th!
        </p>
      </div>
    </div>
  );
}
