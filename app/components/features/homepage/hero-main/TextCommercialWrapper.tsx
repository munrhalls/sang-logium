import React from "react";
import { Suspense } from "react";
import { getCommercialHeroMain } from "@/sanity/lib/commercials/getCommercialHeroMain";
import TextCommercial from "@/app/components/ui/commercials/textCommercial";

const Loader = function () {
  return (
    <div className="h-full flex items-center justify-center gap-2 text-sm text-gray-500">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-gray-700"></div>
    </div>
  );
};

export default async function TextCommercialWrapper() {
  const commercial = await getCommercialHeroMain();
  const { text, image, sale, ctaLink = null } = commercial;

  return (
    <Suspense fallback={<Loader />}>
      <TextCommercial text={text} ctaLink={ctaLink} />
    </Suspense>
  );
}
