import Image from "next/image";
import imageUrl from "@/lib/imageUrl";
import { Sale } from "@/sanity.types";
import Link from "next/link";
import TextOverlay from "./textOverlay";
import Logo from "../../../../../public/icons/Logo.svg";
import Ellipse from "../../../../../public/icons/Ellipse.svg";
import ChevronLeft from "../../../../../public/icons/ChevronLeft.svg";
import ChevronRight from "../../../../../public/icons/ChevronRight.svg";

export default function HeroCarousel({ sales }: { sales: Sale[] }) {
  console.log("Sales 1, 2", sales[0].slug, sales[1]?.slug);

  const christmasSale = sales.find(
    (sale) => sale?.slug?.current === "christmas-gifts"
  );

  const cta = christmasSale?.slug ? (
    <div
      style={{
        backgroundColor: "#CF8226",
        border: "1px solid #fff",
      }}
      className="mt-auto rounded-sm flex flex-col justify-center items-center h-12 w-32"
    >
      <Link
        className="text-white text-xl font-black text-center block"
        href={`categories/sale/${christmasSale.slug.current}`}
      >
        <span>SEE NOW</span>
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

  const textOverlay = christmasSale ? (
    <div className="p-4 absolute inset-0 right-[20%] flex flex-col justify-start font-black text-white scale-[1.0] 2xs:inset-[10%] 2xs:right-[30%] 2xs:scale-[1.2] sm:inset-[20%] sm:scale-[1.5] md:inset-[25%] md:scale-[1.8] lg:inset-[30%] lg:scale-[2.0] xl:inset-[32.5%] xl:scale-[2.5] 2xl:inset-[35%] 2xl:scale-[2.75] 3xl:inset-[37.5%] 3xl:scale-[3.5]">
      {title}
      {subtitle}
      {percentOff}
      {cta}
    </div>
  ) : null;

  const btnSlideLeft = (
    <button className="z-50 text-white text-3xl absolute left-0 top-0 bottom-0">
      <Image src={ChevronLeft} alt="Chevron Left" />
    </button>
  );

  const btnSlideRight = (
    <button className="z-50 text-white text-3xl absolute top-0 bottom-0 right-0">
      <Image src={ChevronRight} alt="Chevron Right" />
    </button>
  );

  const christmasSaleSlide = christmasSale?.image ? (
    <div className={`absolute inset-0 rounded z-40`}>
      {/* // TODO - heroSlider */}
      <Image
        src={imageUrl(christmasSale.image).url()}
        fill
        sizes="100vw"
        className="object-cover object-[90%_0%] md:object-[30%_40%]"
        alt="Christmas Sale"
        priority
      />
      {textOverlay}
    </div>
  ) : null;

  return (
    <div className="relative h-full w-full overflow-auto font-oswald">
      {" "}
      {christmasSaleSlide}
      {christmasSaleSlide}
      {christmasSaleSlide}
      {/* //TODO - heroControls */}
      {btnSlideLeft}
      {btnSlideRight}
      <div className="z-50 absolute left-0 right-0 bottom-6 flex justify-center items-center gap-2">
        <Image src={Logo} alt="Logo" />
        <Image src={Ellipse} alt="Ellipse" />
        <Image src={Ellipse} alt="Ellipse" />
        <Image src={Ellipse} alt="Ellipse" />
        <Image src={Ellipse} alt="Ellipse" />
      </div>
    </div>
  );
}
