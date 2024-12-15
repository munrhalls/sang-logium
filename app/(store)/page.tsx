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

  const headerHeight = 90;
  const navbarHeight = 64;
  const offsetTopXL = `${headerHeight + navbarHeight}px`;

  const carouselHeight = `calc(100vh - ${headerHeight + navbarHeight}px)`;

  const cta = christmasSale?.slug ? (
    <div
      style={{
        backgroundColor: "#CF8226",
        borderRadius: "50%",
        border: "1px solid #fff",
      }}
      className="mt-8 flex flex-col justify-center items-center h-32 w-32 xl:h-80 xl:w-80"
    >
      <Link
        className=" text-white xs:text-xs sm:text-xl xl:text-5xl font-black text-center mt-2 block"
        href={`categories/sale/${christmasSale.slug.current}`}
      >
        SEE NOW
      </Link>
    </div>
  ) : null;

  const textOverlay = christmasSale ? (
    <div className="absolute left-0 top-0 right-[50%] bottom-0 flex flex-col justify-around items-center p-8  font-black  text-white">
      <h1 className="text-xl md:text-3xl xl:text-5xl leading-loose">
        Christmas <span style={{ color: "#CF8226" }}>GIFTS!</span>
      </h1>
      <p className="ml-4 md:text-2xl xl:text-3xl xl:mt-8 leading-loose">
        <span style={{ color: "#CF8226" }}>ALL</span> WIRELESS HEADPHONES {""}
      </p>
      <p className="md:text-2xl xl:text-6xl xl:mt-8">
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
        className="object-cover object-[50%_15%]"
        alt="Christmas Sale"
        priority
      />
      {textOverlay}
    </div>
  ) : null;

  return (
    <main style={{ height: `${carouselHeight}` }}>
      <div className="h-full grid grid-cols-4 grid-rows-1 ">
        <div className="col-span-4 xl:col-span-3 col-start-1 bg-slate-300">
          <div className="relative h-full w-full overflow-hidden font-oswald">
            {christmasSaleSlide}
          </div>
        </div>
        <div className="xl:col-start-4 xl:col-span-1 hidden"></div>
      </div>
      {/* <div style={{ height: "1500px" }}>asda</div> */}
    </main>
  );
}
