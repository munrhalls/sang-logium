import { PortableText } from "@portabletext/react";
import { PortableTextComponents } from "@portabletext/react";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";
import Link from "next/link";

type CommercialText = NonNullable<
  GET_COMMERCIALS_BY_FEATURE_QUERYResult[number]["text"]
>;

interface TextCommercialProps {
  text: CommercialText;
}
export default function TextCommercial({ text }: TextCommercialProps) {
  const buttonColor =
    text[0]?.markDefs?.find((mark) => mark._type === "textColor")?.value ||
    "#CF8226";

  const components: PortableTextComponents = {
    block: {
      h1: ({ children }) => (
        <h1 className="text-4xl font-black mb-2">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-2xl font-bold mb-2">{children}</h2>
      ),
      normal: ({ children }) => <p className="text-xl mb-2">{children}</p>,
    },
    marks: {
      textColor: ({ value, children }) => (
        <span style={{ color: value?.value || "inherit" }}>{children}</span>
      ),
    },
  };

  return (
    <div className="z-40 bg-black/40 p-4 grid md:p-8 md:space-x-4 md:space-y-3 rounded-sm text-white">
      <PortableText value={text} components={components} />;
      <Link
        href="asdasaxzc"
        prefetch={true}
        className="inline max-w-[10rem] text-center text-xl text-white font-black px-6 py-2 rounded-sm mt-4 md:mt-12"
        style={{ backgroundColor: `${buttonColor}` }}
      >
        SEE MORE
      </Link>
    </div>
  );
}
