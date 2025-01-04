import { PortableText } from "@portabletext/react";
import { Commercial } from "@/sanity.types";

interface TextOverlayProps {
  text: Commercial["text"];
}

const components = {
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-bold text-white mb-2">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-medium text-white mb-2">{children}</h2>
    ),
    normal: ({ children }: any) => (
      <p className="text-lg text-white">{children}</p>
    ),
  },
};

export default function TextOverlay({ text }: TextOverlayProps) {
  if (!text) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-center items-start p-8">
      <PortableText value={text} components={components} />
    </div>
  );
}
