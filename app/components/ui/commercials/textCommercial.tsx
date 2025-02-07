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
        <h1 className="text-2xl lg:text-5xl font-black">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-xl lg:text-3xl font-bold">{children}</h2>
      ),
      normal: ({ children }) => (
        <p className="text-xl lg:text-3xl">{children}</p>
      ),
    },
    marks: {
      textColor: ({ value, children }) => (
        <span style={{ color: value?.value || "inherit" }}>{children}</span>
      ),
    },
  };

  return (
    <div className="/* TEXT COMMERCIAL */ h-full  z-30 text-white grid place-content-center">
      <div className="z-20 bg-black/40 grid place-items-center p-12  space-y-2 md:space-y-4 lg:space-y-6 rounded-sm">
        <PortableText value={text} components={components} />;
      </div>
      <div className="z-20 grid place-items-center">
        <Link
          href={ctaLink}
          className="z-20 block max-w-[10rem] text-center text-xl text-white font-black px-6 py-2 rounded-sm mt-4 md:mt-12"
          style={{ backgroundColor: `${buttonColor}` }}
        >
          SEE MORE
        </Link>
      </div>
    </div>
  );
}
