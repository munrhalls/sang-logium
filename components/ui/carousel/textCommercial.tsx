import { PortableText } from "@portabletext/react";
import { PortableTextComponents } from "@portabletext/react";
import { useMemo } from "react";

import Link from "next/link";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";
interface TextCommercialProps {
  commercial: GET_COMMERCIALS_BY_FEATURE_QUERYResult[0];
}

const components: PortableTextComponents = {
  marks: {
    textColor: ({ children, value }) => (
      <span style={{ color: value.value }}>{children}</span>
    ),
  },
};

export default function TextCommercial({ commercial }: TextCommercialProps) {
  const { text, slug } = commercial;
  const buttonColor = useMemo(() => {
    const firstColorMark = text?.[0]?.markDefs?.find(
      (mark) => mark._type === "textColor"
    );
    return firstColorMark?.value || "#CF8226";
  }, [text]);

  if (!text) return null;

  return (
    <div className="relative h-full w-full py-4 px-10 md:p-16 lg:p-24 grid place-content-center">
      <div className="bg-black/30 inline px-2 py-4 space-y-3 rounded-lg font-oswald text-center text-white font-black text-xs 2xs:space-y-6 2xs:text-2xl 2xs:px-12 2xs:py-12 lg:text-3xl">
        <PortableText value={text} components={components} />

        <Link
          href={`/sale/${slug}`}
          prefetch={true}
          className="inline-block font-black rounded-lg tracking-wide text-sm text-white py-1 px-3 2xs:text-lg 2xs:py-2 2xs:px-6 lg:text-2xl lg:px-8 lg:py-4 "
          style={{ backgroundColor: buttonColor }}
        >
          SEE NOW
        </Link>
      </div>
    </div>
  );
}
