import { PortableText } from "@portabletext/react";
import { Commercial } from "@/sanity.types";
import Link from "next/link";

interface TextOverlayProps {
  text: Commercial["text"];
}

export default function TextOverlay({ text }: TextOverlayProps) {
  console.log("Text data:", JSON.stringify(text, null, 2));

  if (!text) return null;

  const firstColorMark = text[0]?.markDefs?.find(
    (mark) => mark._type === "textColor"
  );
  const buttonColor = firstColorMark?.value || "#CF8226";

  const components = {
    block: {
      h1: ({ children }: any) => (
        <h1 className="text-white text-2xl 2xs:text-3xl md:text-4xl xl:text-6xl font-bold">
          {children}
        </h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-white text-lg 2xs:text-2xl md:text-3xl xl:text-4xl font-bold">
          {children}
        </h2>
      ),
    },
    marks: {
      textColor: ({ children, value }: any) => (
        <span style={{ color: value.value }}>{children}</span>
      ),
    },
  };

  return (
    <div className="absolute inset-0 flex items-center">
      <div className="w-[75%] md:w-[70%] lg:w-[70%] mx-auto flex justify-center">
        <div className="bg-black/30 my-10 2xs:w-[80%] md:w-[80%] p-4 md:p-6 md:py-12 2xl:py-32 rounded-lg text-center space-y-2 md:space-y-4 lg:space-y-8">
          <PortableText value={text} components={components} />
          <div className="flex justify-center">
            <Link
              href="/categories/sale/january-gifts"
              className="font-black inline-block mt-6 md:mt-8 lg:mt-12 px-6 py-2 md:px-12 md:py-6 lg:px-14 lg:py-8 xl:px-20  text-white text-xl 2xs:text-2xl md:text-3xl lg:text-4xl xl:text-4xl rounded-lg"
              style={{ backgroundColor: buttonColor }}
            >
              SEE NOW
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
