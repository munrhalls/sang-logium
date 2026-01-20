import Image from "next/image";
import PromotionCommercial from "./PromotionCommercial";
import { getPromotionByName } from "@/sanity/lib/promotions/getPromotionByName";
import PromotionImage from "@/app/components/ui/promotion-image/PromotionImage";
import SmallTest from "./SmallTest";
import SmallTest2 from "./SmallTest2";

export default async function HeroMain() {
  const promotion = await getPromotionByName("Main Hero");
  const imageData = promotion.image;
  const textData = {
    // headline: promotion.headline,
    _id: promotion._id,
    description: promotion.description,
    discountPercent: promotion.discountPercent,
    actionLabel: promotion.actionLabel,
  };
  console.log(textData, "text data at main as qeweasdsads as");

  return (
    <div className="relative grid h-full grid-rows-[1fr_3rem]">
      <div className="relative z-30 h-full w-full overflow-hidden">
        <div className="relative h-full flex-[0_0_100%]">
          <PromotionImage
            imageData={imageData}
            // alt={textData.description[0].text}
          />
          {/* <PromotionCommercial textData={textData} /> */}
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-2">
            <SmallTest />
          </div>
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
