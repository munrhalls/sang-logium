import { PortableText } from "@portabletext/react";

const components = {
  block: {
    normal: ({ children }: any) => <span>{children}</span>,
  },
  marks: {
    color: ({ value, children }: any) => (
      <span style={{ color: value?.hex }}>{children}</span>
    ),
    strong: ({ children }: any) => <strong>{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
  },
};

export default function CTA({
  text,
  background,
}: {
  text: any;
  background: string;
}) {
  return (
    <button
      className="inline-flex items-center justify-center rounded-lg border border-transparent px-6 py-3 text-base font-medium text-white shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        backgroundColor: background,
      }}
    >
      <PortableText value={text} components={components} />
    </button>
  );
}
