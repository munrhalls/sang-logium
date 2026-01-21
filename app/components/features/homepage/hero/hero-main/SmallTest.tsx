import { PortableText } from "@portabletext/react";
import { smallTest } from "@/sanity/lib/promotions/smallTest";
import CTA from "@/app/components/ui/buttons/CTA";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

const components = {
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-center text-[clamp(32px,5vw,64px)] font-bold leading-[1.1] tracking-tight drop-shadow-md">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-center text-[clamp(18px,2.5vw,32px)] font-semibold leading-[1.2] opacity-90 drop-shadow-sm">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-center text-[clamp(16px,2vw,28px)] font-medium leading-snug">
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p className="mx-auto max-w-2xl text-center text-[clamp(14px,1.5vw,18px)] opacity-80">
        {children}
      </p>
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

  if (!text) return <div>No headline found</div>;

  return (
    <div className="relative flex min-h-[400px] w-full flex-col items-center justify-center overflow-hidden py-12 md:min-h-[500px] xl:min-h-[600px]">
      <div className="z-10 flex w-[90%] max-w-[1000px] flex-col items-center justify-center gap-[clamp(8px,1.5vw,20px)] text-white">
        <PortableText value={text} components={components} />
        <div className="mt-[clamp(16px,2vw,32px)] flex w-[clamp(120px,13vw,180px)] justify-center">
          <CTA text={data.cta_text} background={data.cta_background} />
        </div>
      </div>
    </div>
  );
}
