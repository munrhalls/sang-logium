import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
import { PortableText } from "@portabletext/react";
import { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import Link from "next/link";
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
    <div className="grid py-24 lg:pb-40 lg:pt-60 md:grid-cols-2 xl:grid-cols-[1fr_3fr_3fr_1fr] bg-gradient-to-b from-blue-950/95 via-gray-950/100 to-black">
      <Image
        src={imageUrl(image).url()}
        loading="lazy"
        height={980}
        width={1280}
        alt={""}
        quality={60}
        className="z-50 mb-12 mx-auto max-w-[300px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[600px] xl:max-w-[850px] xl:max-h-[800px] lg:col-start-1 xl:col-start-2 lg:col-span-1  object-cover rounded-lg "
      />
      <div className="h-full w-full grid md:place-content-center xl:justify-center gap-1 md:gap-2 lg:col-start-2 xl:col-start-3 lg:col-span-2 xl:col-span-1 text-blue-950">
        <PortableText value={text} components={components} />;
        <Link
          href={`/product/${product._id}`}
          className="grid place-content-center group"
        >
          <button
            className="bg-blue-950 text-white px-4 py-2 rounded-sm transition-all duration-300 ease-out
        hover:bg-blue-900 hover:border-blue-700
        hover:shadow-xl hover:shadow-blue-950/50
        hover:drop-shadow-xl"
            type="button"
          >
            SHOP NOW
          </button>
        </Link>
      </div>
    </div>
  );
}
