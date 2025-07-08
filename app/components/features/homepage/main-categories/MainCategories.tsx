import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
import { imageUrl } from "@/lib/imageUrl";
import Image from "next/image";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";
import { PortableText } from "@portabletext/react";
import { PortableTextComponents } from "@portabletext/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default async function MainCategories() {
  const commercials = await getCommercialsByFeature("main-categories");
  if (!commercials || !commercials.length) return null;
  const verified = commercials.filter(
    (
      commercial,
    ): commercial is NonNullable<
      GET_COMMERCIALS_BY_FEATURE_QUERYResult[number] & {
        image: NonNullable<string>;
        ctaLink: NonNullable<string>;
        text: NonNullable<
          GET_COMMERCIALS_BY_FEATURE_QUERYResult[number]["text"]
        >;
        order: number;
      }
    > => {
      return (
        commercial.image !== null &&
        commercial.text !== null &&
        commercial.ctaLink !== null
      );
    },
  );
  verified.sort((a, b) => a.order - b.order);
  const components: PortableTextComponents = {
    block: {
      h1: ({ children }) => (
        <h1
          className={` z-50 text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black tracking-wider text-white p-3 pt-4 rounded-xl`}
        >
          {children}
        </h1>
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
    <div className="relative h-full grid grid-rows-3 place-items-center lg:grid-rows-1 lg:grid-cols-3 bg-black">
      {verified &&
        verified.map((commercial, index) => (
          <div
            key={commercial._id + "_mainCategory"}
            className="z-30 relative h-full min-h-[350px] max-w-[400px] max-h-[300px] lg:min-h-[375px] xl:min-h-[450px] lg:max-w-[600px] w-full grid place-content-center bg-black "
          >
            <Link
              href={commercial.ctaLink}
              className="h-full w-full z-50  grid place-content-center rounded-xl"
            >
              <div
                className={`z-50 ${index < 2 ? "bg-black/30" : ""} rounded-xl p-4 `}
              >
                <PortableText value={commercial.text} components={components} />
              </div>
              <div
                className={`z-20 w-full text-center text-xl text-white font-black px-6  rounded-sm  grid place-content-center cursor-pointer ${index < 2 ? "py-2 mt-4" : "mb-8 text-2xl"}`}
              >
                <ArrowRight size={64} />
              </div>
            </Link>
            <Image
              src={imageUrl(commercial.image).url()}
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              fill
              className="absolute inset-0 w-full h-full aspect-square"
              quality={85}
              sizes="(max-width: 1023px) 400px, 600px"
              alt={commercial.title || "Sale"}
            />
          </div>
        ))}
    </div>
  );
}
