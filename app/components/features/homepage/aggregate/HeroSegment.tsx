import { Suspense } from "react";
import HeroMain from "../hero/hero-main/HeroMain";
import HeroCommercialsSkeleton from "../hero/hero-commercials/HeroCommercialsSkeleton";
// import HeroCommercials from "../hero/hero-commercials/HeroCommercials";
import HeroSegment from "@/app/components/features/hero-segment/HeroSegment";

export default function Hero() {
  return (
    <section>
      <HeroMain />
      <Suspense fallback={<HeroCommercialsSkeleton />}>
        {/* <HeroCommercials /> */}
        <HeroSegment />
      </Suspense>
    </section>
  );
}
