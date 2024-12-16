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

export default async function SalesCarousel() {
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
      className="mt-auto rounded-sm md:rounded-full flex flex-col justify-center items-center h-12 md:h-32 w-32 xl:h-80 xl:w-80"
    >
      <Link
        className=" text-white xs:text-xs sm:text-xl xl:text-5xl font-black text-center md:mt-2 block"
        href={`categories/sale/${christmasSale.slug.current}`}
      >
        SEE NOW
      </Link>
    </div>
  ) : null;

  const textOverlay = christmasSale ? (
    <div className="absolute left-0 top-0 md:right-[50%] bottom-0 flex flex-col justify-start md:justify-around items-start md:items-center p-2 md:p-8  font-black  text-white">
      <h1 className="text-md md:text-3xl xl:text-5xl leading-loose">
        Christmas <span style={{ color: "#CF8226" }}>GIFTS!</span>
      </h1>
      <p className="md:ml-4 text-xs md:text-2xl xl:text-3xl xl:mt-8 leading-loose">
        <span style={{ color: "#CF8226" }}>ALL</span> WIRELESS HEADPHONES {""}
      </p>
      <p className="text-md md:text-2xl xl:text-6xl xl:mt-8">
        <span style={{ color: "#CF8226" }}>-25%! </span>
      </p>
      {cta}
    </div>
  ) : null;

  const christmasSaleSlide = christmasSale?.image ? (
    <div className={`absolute inset-0 rounded`}>
      <Image
        src={imageUrl(christmasSale.image).url()}
        fill
        sizes="100vw"
        className="object-cover object-[90%_50%] md:object-[50%_50%]"
        alt="Christmas Sale"
        priority
      />
      {textOverlay}
    </div>
  ) : null;

  return (
    <div className="relative h-full">
      <div className="grid grid-cols-4 grid-rows-1 ">
        <div className="col-span-4 xl2:col-span-3 col-start-1 bg-slate-300">
          <div className="relative h-full w-full overflow-hidden font-oswald">
            {christmasSaleSlide}
          </div>
        </div>
        <div className="xl:col-start-4 xl:col-span-1 hidden"></div>
      </div>
      {/* <div style={{ height: "1500px" }}>asda</div> */}
    </div>
  );
}
