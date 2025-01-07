import { PortableText } from "@portabletext/react";
import { PortableTextComponents } from "@portabletext/react";

import Link from "next/link";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";
interface TextOverlayProps {
  text: GET_COMMERCIALS_BY_FEATURE_QUERYResult[0]["text"];
}

export default function TextOverlay({ text }: TextOverlayProps) {
  if (!text) return null;

  const firstColorMark = text[0]?.markDefs?.find(
    (mark) => mark._type === "textColor"
  );
  const buttonColor = firstColorMark?.value || "#CF8226";

  const components: PortableTextComponents = {
    marks: {
      textColor: ({ children, value }) => (
        <span style={{ color: value.value }}>{children}</span>
      ),
    },
  };

  return (
    <div className="relative h-full w-full grid place-content-center">
      <div className="bg-black/30 inline px-4 py-8 space-y-3 rounded-lg text-center text-white font-black 2xs:space-y-6 2xs:text-2xl 2xs:px-12">
        <PortableText value={text} components={components} />

        <Link
          href="/categories/sale/january-gifts"
          className="inline-block font-black rounded-lg text-white py-1 px-3 2xs:py-2 2xs:px-6"
          style={{ backgroundColor: buttonColor }}
        >
          SEE NOW
        </Link>
      </div>
    </div>
  );
}
