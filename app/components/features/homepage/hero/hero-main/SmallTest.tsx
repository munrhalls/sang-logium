import { PortableText } from "@portabletext/react";
import { smallTest } from "@/sanity/lib/promotions/smallTest";
import CTA from "@/app/components/ui/buttons/CTA";

const components = {
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-center text-4xl font-bold md:text-7xl lg:text-8xl">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-center text-3xl font-semibold md:text-5xl lg:text-6xl">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-center text-2xl font-medium md:text-4xl lg:text-5xl">
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p className="text-center text-lg md:text-xl lg:text-2xl">{children}</p>
    ),
    small: ({ children }: any) => (
      <p className="text-center text-sm md:text-base lg:text-lg">{children}</p>
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

  if (!text) {
    return <div>No headline found</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <PortableText value={text} components={components} />
      <CTA text={data.cta_text} background={data.cta_background} />
    </div>
  );
}
