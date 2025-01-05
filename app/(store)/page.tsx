import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
import BaseCarousel from "@/components/ui/carousel/baseCarousel";

export default async function Page() {
  const commercials = await getCommercialsByFeature("hero");

  return (
    <div
      style={{
        height: `calc(100vh - var(--header-height) - var(--categories-nav-height) - var(--footer-height))`,
      }}
      className="grid grid-cols-4 grid-rows-1 bg-blue-300"
    >
      <div className="col-span-4 col-start-1 bg-slate-300">
        {commercials?.length && <BaseCarousel commercials={commercials} />}
      </div>
    </div>
  );
}
