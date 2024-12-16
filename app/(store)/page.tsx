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
import { FaArrowRight } from "react-icons/fa";

export default async function Page() {
  const sales = await getAllSales();
  console.log("Sales", sales[0]);
  const christmasSale = sales.find(
    (sale) => sale?.slug?.current === "christmas-gifts"
  );

  const cta = christmasSale?.slug ? (
    <div
      style={{
        backgroundColor: "#CF8226",
        border: "1px solid #fff",
      }}
      className=" mt-auto  rounded-sm flex flex-col justify-center items-center h-12 w-32"
    >
      <Link
        className=" text-white xs:text-xs sm:text-xl xl:text-5xl font-black text-center md:mt-2 block"
        href={`categories/sale/${christmasSale.slug.current}`}
      >
        SEE NOW
      </Link>
    </div>
  ) : null;

  const title = (
    <h1 className="text-xl">
      Christmas <span style={{ color: "#CF8226" }}>GIFTS!</span>
    </h1>
  );
  const subtitle = (
    <p className="mt-2 text-xs pr-[50%]">
      <span style={{ color: "#CF8226" }}>ALL</span> WIRELESS HEADPHONES {""}
    </p>
  );

  const percentOff = (
    <p className="mt-2 text-2xl">
      <span style={{ color: "#CF8226" }}>-25%! </span>
    </p>
  );
  //TODO
  const textOverlay = christmasSale ? (
    <div className="p-4 absolute inset-0 right-[20%] flex flex-col justify-start font-black  text-white scale-[1.0] 2xs:inset-[10%] 2xs:right-[35%] 2xs:scale-[1.2] sm:inset-[20%] sm:scale-[1.5] md:scale-[0.8] lg:scale-100">
      {title}
      {subtitle}
      {percentOff}
      {cta}
    </div>
  ) : null;

  const christmasSaleSlide = christmasSale?.image ? (
    <div className={`absolute inset-0 rounded z-40`}>
      <Image
        src={imageUrl(christmasSale.image).url()}
        fill
        sizes="100vw"
        className="object-cover object-[70%_100%] md:object-[50%_50%]"
        alt="Christmas Sale"
        priority
      />
      {textOverlay}
    </div>
  ) : null;

  console.log("Christmas Sale Slide", christmasSaleSlide);

  return (
    <div
      style={{
        height: `calc(100vh - var(--header-height) - var(--categories-nav-height))`,
      }}
      className="grid grid-cols-4 grid-rows-1 bg-blue-300"
    >
      <div className="col-span-4 xl:col-span-3 col-start-1 bg-slate-300">
        <div className="relative h-full w-full overflow-auto font-oswald">
          {christmasSaleSlide}
        </div>
      </div>
      <div className="xl:col-start-4 xl:col-span-1 hidden"></div>
    </div>
  );
}
