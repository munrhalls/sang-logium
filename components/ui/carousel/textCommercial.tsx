import { PortableText } from "@portabletext/react";
import { PortableTextComponents } from "@portabletext/react";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";

const components: PortableTextComponents = {
  // h1: ({ children }) => <h1 className="text-xs m-0">{children}</h1>,
  // h2: ({ children }) => <h2 className="text-xs m-0">{children}</h2>,
  marks: {
    textColor: ({ children, value }) => (
      <span style={{ color: value.value }}>{children}</span>
    ),
  },
};

type CommercialText = NonNullable<
  GET_COMMERCIALS_BY_FEATURE_QUERYResult[number]["text"]
>;

interface TextCommercialProps {
  text: CommercialText;
}

export default function TextCommercial({ text }: TextCommercialProps) {
  if (!text) return null;

  return <PortableText value={text} components={components} />;
}
