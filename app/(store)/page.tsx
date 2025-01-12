import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
import Carousel from "@/components/ui/carousel/carousel";

export default async function Page() {
  const heroCommercials = await getCommercialsByFeature("hero");

  return (
    <div
      style={{
        height: `calc(100vh - var(--header-height) - var(--categories-nav-height) - var(--footer-height))`,
      }}
      className="grid grid-cols-4 grid-rows-1 bg-blue-300"
    >
      <div className="col-span-4 col-start-1 bg-slate-300">
        {heroCommercials && <Carousel commercials={heroCommercials} />}
      </div>
    </div>
  );
}
