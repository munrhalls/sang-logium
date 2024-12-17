import Link from "next/link";
import { Sale } from "@/sanity.types";

export default function TextOverlay({ sale }: { sale: Sale }) {
  const cta = sale?.slug ? (
    <div
      style={{
        backgroundColor: "#CF8226",
        border: "1px solid #fff",
      }}
      className="mt-auto rounded-sm flex flex-col justify-center items-center h-12 w-32"
    >
      <Link
        className="text-white text-xl font-black text-center block"
        href={`categories/sale/${sale.slug.current}`}
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

  return sale ? (
    <div className="p-4 absolute inset-0 right-[20%] flex flex-col justify-start font-black text-white scale-[1.0] 2xs:inset-[10%] 2xs:right-[30%] 2xs:scale-[1.2] sm:inset-[20%] sm:scale-[1.5] md:inset-[25%] md:scale-[1.8] lg:inset-[30%] lg:scale-[2.0] xl:inset-[32.5%] xl:scale-[2.5] 2xl:inset-[35%] 2xl:scale-[2.75] 3xl:inset-[37.5%] 3xl:scale-[3.5]">
      {title}
      {subtitle}
      {percentOff}
      {cta}
    </div>
  ) : null;
}