// import Image from "next/image";
// import LogoOrbit from "@/public/logo-orbit.svg";
import SegmentTitle from "../../ui/segment-title/SegmentTitle";
import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
import { imageUrl } from "@/lib/imageUrl";
import Image from "next/image";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";
import { PortableText } from "@portabletext/react";
import { PortableTextComponents } from "@portabletext/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function MainCategories() {
  // const image = { width: 400, height: 300, title: "Square (1:1)" };

  const commercials = await getCommercialsByFeature("main-categories");
  if (!commercials || !commercials.length) return null;

  const verified = commercials.filter(
    (
      commercial
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
    }
  );

  verified.sort((a, b) => a.order - b.order);

  const components: PortableTextComponents = {
    block: {
      h1: ({ children }) => (
        <h1
          className={`z-50 text-7xl font-black tracking-wider text-white p-3 pt-4 rounded-xl}`}
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
    <div className="min-h-[800px] grid grid-rows-[1fr_4fr]">
      <SegmentTitle title="Main Categories" />
      <div className="h-full grid-cols-[2fr_3fr]">
        <div className="relative h-full grid grid-rows-3 md:grid-rows-1 md:grid-cols-3">
          {verified &&
            verified.map((commercial, index) => (
              <div
                key={commercial._id + "_mainCategory"}
                className="z-30 relative h-full min-h-[350px] w-full grid place-content-center "
              >
                <Link
                  href={commercial.ctaLink}
                  className=" h-full w-full z-50  grid place-content-center    rounded-xl"
                >
                  <PortableText
                    value={commercial.text}
                    components={components}
                  />
                  <div className="z-20 w-full text-center text-xl text-white font-black px-6 py-2 rounded-sm mt-4 md:mt-12 grid place-content-center cursor-pointer">
                    <ArrowRight size={96} />
                  </div>
                </Link>
                <Image
                  src={imageUrl(commercial.image).url()}
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  width={1280}
                  height={720}
                  style={{ objectPosition: "50% 25%" }}
                  className="absolute inset-0 w-full h-full object-cover"
                  quality={85}
                  sizes="100vw"
                  alt={commercial.title || "Sale"}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
