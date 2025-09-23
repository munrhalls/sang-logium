import Image from "next/image";
import { getCommercialsHeroMain } from "@/sanity/lib/commercials/getCommercialsHeroMain";
import TextCommercial from "@/app/components/ui/commercials/textCommercial";

export default async function HeroMain() {
  const commercial = await getCommercialsHeroMain();
  const {
    text,
    image,
    sale,
    ctaLink = null,
    title = "Hero commercial",
  } = commercial;

  return (
    <div className="isolate relative h-full grid grid-rows-[1fr_3rem]">
      <div className="relative h-full w-full z-30 overflow-hidden">
        <div className="h-full relative flex-[0_0_100%]">
          <Image
            src={image}
            priority
            loading="eager"
            fetchPriority="high"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1920px"
            style={{ objectFit: "cover", objectPosition: "right" }}
            className={`absolute inset-0 w-full h-full object-cover hero-image`}
            quality={75}
            alt={"Sang logium"}
          />
          <TextCommercial text={text} ctaLink={ctaLink} />
        </div>
      </div>

      <div className="z-50 h-full w-full bg-black ">
        <p className="h-full text-xs sm:text-sm lg:text-lg text-white font-black tracking-wide lg:tracking-wider flex items-center justify-center">
          Offer available only until November 30th!
        </p>
      </div>
    </div>
  );
}
