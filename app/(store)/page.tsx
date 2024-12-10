import { getAllSales } from "@/sanity/lib/sales/getAllSales";
import Image from "next/image";
import imageUrl from "@/lib/imageUrl";
import { Sale } from "@/sanity.types";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SalesCarousel() {
  const sales = await getAllSales();
  console.log("Sales", sales[0]);

  const christmasSale = sales.find(
    (sale) => sale?.slug?.current === "christmas-gifts"
  );

  const christmasSaleSlide = christmasSale?.image ? (
    <div className="font-gruppo relative aspect-[4/3] lg:aspect-[16/9] w-full xl:w-5/6">
      <Image
        src={imageUrl(christmasSale.image).url()}
        fill
        sizes="100vw"
        priority
        className="object-fit"
        alt="Christmas Sale"
      />

      {/* This wrapper ensures consistent positioning */}
      <div className="absolute inset-0 flex justify-end">
        {/* Content container with padding */}
        <div className="p-2 pt-6 md:p-8 top-0 right-0 w-3/5 h-3/5 ">
          <h1 className="xs:text-3xl text-3xl text-white">
            Christmas <span style={{ color: "#CF8226" }}>GIFTS!</span>
          </h1>
          <p className="text-md">
            <span style={{ color: "#CF8226" }}>ALL</span> wireless headphones
          </p>
          <div className="text-3xl text-center">
            <span style={{ color: "#CF8226" }}>-25%</span>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="h-72 lg:h-full">
        {/* Hero carousel with background images */}
        <div className="flex items-start justify-center relative h-full border-s-black bg-fit bg-center text-white">
          {christmasSaleSlide}
        </div>
      </div>
      {/* Content below scrolls normally */}
      <div>Scrollable content</div>

      <div className="h-96 bg-white">some other stuff</div>
      <div className="h-96 bg-orange-600">some other stuff</div>
      <div className="h-96 bg-teal-500">some other stuff</div>
      <div className="h-96 bg-yellow-400">some other stuff</div>
    </main>
  );
}
