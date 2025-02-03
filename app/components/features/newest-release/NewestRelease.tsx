import SegmentTitle from "../../ui/segment-title/SegmentTitle";
import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
import { PortableText } from "@portabletext/react";
import { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";

export default async function NewestRelease() {
  const [commercial] = await getCommercialsByFeature("newest-release");
  if (!commercial.image || !commercial.products || !commercial.text)
    return null;
  const text = commercial.text;
  const image = commercial?.image;
  const products = commercial?.products;
  const product = products[0];

  const components: PortableTextComponents = {
    block: {
      h1: ({ children }) => (
        <h1 className="text-xl lg:text-3xl font-black text-white flex justify-center">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-sm lg:text-xl font-bold text-white flex justify-center">
          {children}
        </h2>
      ),
      normal: ({ children }) => (
        <p className="text-sm lg:text-xl text-white flex justify-center">
          {children}
        </p>
      ),
    },
    marks: {
      textColor: ({ value, children }) => (
        <span style={{ color: value?.value || "inherit" }}>{children}</span>
      ),
    },
  };

  return (
    <div
      className="min-h-[800px] grid place-content-center grid-rows-[4rem_2fr_1fr] md:grid-cols-[1fr_1fr]
    bg-gradient-to-b from-blue-950/95 via-gray-950/100 to-black"
    >
      <div className="row-start-2 row-span-2 md:col-start-1 md:col-span-1 relative h-full w-full">
        <Image
          src={imageUrl(image).url()}
          loading="lazy"
          height={1080}
          width={720}
          alt={""}
          quality={90}
          className="z-50 absolute inset-0 w-full h-full object-cover rounded-sm"
        />
        {/* <h2 className="row-start-3 row-span-1 text-white text-2xl font-black text-center mb-2">
          {product.name}
        </h2> */}
      </div>
      <div className="row-start-3 md:row-start-2 md:col-start-2 md:col-span-1 grid place-content-center gap-3 text-blue-950">
        <PortableText value={text} components={components} />;
      </div>
      <div className="grid md:grid-cols-[1fr_1fr]"></div>
    </div>
  );
}
