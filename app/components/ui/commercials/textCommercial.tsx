import { PortableText } from "@portabletext/react";
import { PortableTextComponents } from "@portabletext/react";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";
import Link from "next/link";
type CommercialText = NonNullable<
  GET_COMMERCIALS_BY_FEATURE_QUERYResult[number]["text"]
>;
interface TextCommercialProps {
  text: CommercialText;
  ctaLink: string | null;
}
export default function TextCommercial({ text, ctaLink }: TextCommercialProps) {
  if (ctaLink === null) {
    console.error("Text commercial must have cta link set!");
    return;
  }
  const buttonColor =
    text[0]?.markDefs?.find((mark) => mark._type === "textColor")?.value ||
    "#CF8226";
  const components: PortableTextComponents = {
    block: {
      h1: ({ children }) => (
        <h1 className="text-xl sm:text-4xl lg:text-5xl font-black">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2
          className="text-xl sm:text-4xl lg:text-5xl font-black"
          style={{ marginTop: "3rem" }}
        >
          {children}
        </h2>
      ),
      normal: ({ children }) => (
        <p className="text-xl md:text-3xl">{children}</p>
      ),
    },
    marks: {
      textColor: ({ value, children }) => (
        <span style={{ color: value?.value || "inherit" }}>{children}</span>
      ),
    },
  };
  return (
    <div className=" h-full  z-30 text-white grid place-content-center">
      <div className="z-20 bg-black/40 grid place-items-center m-4 px-8 py-6 sm:px-12 sm:py-12 lg:py-28 sm:space-y-2 md:space-y-28 lg:space-y-40 rounded-sm">
        <PortableText value={text} components={components} />
      </div>
      <div className="z-20 grid place-items-center">
        <Link
          href={ctaLink}
          className=" z-20 block max-w-[15rem] sm:max-w-[35rem] text-center text-sm sm:text-3xl text-white font-black tracking-wide px-8 py-2 sm:py-4 rounded-sm  lg:mt-8"
          style={{ backgroundColor: `${buttonColor}` }}
        >
          SHOP NOW
        </Link>
      </div>
    </div>
  );
}
