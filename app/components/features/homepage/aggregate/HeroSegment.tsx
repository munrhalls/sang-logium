import { Suspense } from "react";
import HeroMain from "../hero/hero-main/HeroMain";
import HeroCommercialsSkeleton from "../hero/hero-commercials/HeroCommercialsSkeleton";
import HeroCommercials from "../hero/hero-commercials/HeroCommercials";

export default function HeroSegment() {
  return (
    <section>
      <HeroMain />
      <Suspense fallback={<HeroCommercialsSkeleton />}>
        <HeroCommercials />
      </Suspense>
    </section>
  );
}
