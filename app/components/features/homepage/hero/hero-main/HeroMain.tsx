import Image from "next/image";
import PromotionCommercial from "./PromotionCommercial";
import { getPromotionByName } from "@/sanity/lib/promotions/getPromotionByName";
import PromotionImage from "@/app/components/ui/promotion-image/PromotionImage";

export default async function HeroMain() {
  const promotion = await getPromotionByName("Main Hero");
  {
    /* TODO just make it display that image */
  }

  console.log("prom", promotion);
  const { src, headline, description, discountPercent, actionLabel } =
    promotion;

  return (
    <div className="relative grid h-full grid-rows-[1fr_3rem]">
      <div className="relative z-30 h-full w-full overflow-hidden">
        <div className="relative h-full flex-[0_0_100%]">
          {/* // TODO fix the error  */}
          <PromotionImage src={src} headline={headline} />
          <PromotionCommercial
            description={description}
            discountPercent={discountPercent}
            actionLabel={actionLabel}
          />
        </div>
      </div>
      <div className="z-30 h-full w-full bg-black">
        <p className="flex h-full items-center justify-center text-xs font-black tracking-wide text-white sm:text-sm lg:text-lg lg:tracking-wider">
          Offer available only until January 30th!
        </p>
      </div>
    </div>
  );
}
