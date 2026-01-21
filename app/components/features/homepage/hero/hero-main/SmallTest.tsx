import { PortableText } from "@portabletext/react";
import { smallTest } from "@/sanity/lib/promotions/smallTest";
import CTA from "@/app/components/ui/buttons/CTA";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

const components = {
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-center text-4xl font-bold drop-shadow-md">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-center text-3xl font-semibold opacity-90 drop-shadow-sm">
        {children}
      </h2>
    ),
  },
  marks: {
    color: ({ value, children }: any) => (
      <span style={{ color: value?.hex }}>{children}</span>
    ),
    strong: ({ children }: any) => (
      <strong className="font-bold">{children}</strong>
    ),
    em: ({ children }: any) => <em className="italic">{children}</em>,
  },
};

export default async function SmallTest() {
  const data = await smallTest();
  const text = data.promotion_text;
  const ctaBgColor = data.cta_background;
  const ctaText = data.cta_text;

  if (!text) return <div>No headline found</div>;

  return (
    <div className="relative flex min-h-[400px] w-full flex-col items-center justify-center overflow-hidden py-12 md:min-h-[500px] xl:min-h-[600px]">
      <div className="z-10 ml-0 flex w-[90%] max-w-[1000px] flex-col items-center justify-center gap-3 text-white lg:ml-80">
        <PortableText value={text} components={components} />
        {/* <div className="mt-[clamp(16px,2vw,32px)] flex w-[clamp(340px,30vw,500px)] justify-center">
          <button
            className="m-auto inline-flex items-center justify-center rounded-lg px-[6vw] py-[2.5vw] text-white shadow-xl transition-all duration-300 hover:brightness-110 focus:outline-none sm:px-6 sm:py-5"
            style={{
              backgroundColor: ctaBgColor,
              textShadow: "0px 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            <span className="w-full text-2xl font-black uppercase tracking-[0.15em] text-white drop-shadow-sm">
              {ctaText}
            </span>
          </button>
        </div> */}
        <button
          className="m-auto mt-20 inline-flex items-center justify-center rounded-md border border-transparent px-14 py-[6px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 hover:brightness-110"
          style={{
            boxShadow: "0 20px 50px rgba(88, 24, 24, 0.4)",
            backgroundColor: ctaBgColor,
          }}
        >
          <span className="font-semibold uppercase tracking-[0.05em] text-white">
            {ctaText}
          </span>
        </button>
      </div>
    </div>
  );
}
