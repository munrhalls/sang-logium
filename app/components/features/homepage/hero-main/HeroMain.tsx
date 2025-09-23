import Image from "next/image";
import { getCommercialHeroMain } from "@/sanity/lib/commercials/getCommercialHeroMain";
import TextCommercial from "@/app/components/ui/commercials/textCommercial";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@sanity/lib/client";

const builder = imageUrlBuilder(client);

export default async function HeroMain() {
  const commercial = await getCommercialHeroMain();
  const {
    text,
    image,
    sale,
    ctaLink = null,
    title = "Hero commercial",
  } = commercial;

  const optimizedImage = builder
    .image(image)
    .width(1920)
    .quality(75)
    .format("webp")
    .url();

  return (
    <div className="isolate relative h-full grid grid-rows-[1fr_3rem]">
      <div className="relative h-full w-full z-30 overflow-hidden">
        <div className="h-full relative flex-[0_0_100%]">
          <Image
            src={optimizedImage}
            priority
            fetchPriority="high"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1920px"
            style={{ objectFit: "cover", objectPosition: "right" }}
            className="hero-image"
            quality={75}
            alt="Sang logium Hero image"
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
