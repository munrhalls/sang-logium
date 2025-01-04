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

  //   const components = {
  //     block: {
  //       h1: ({ children }: any) => (
  //         <h1 className="xs:text-sm md:text-xl font-bold">{children}</h1>
  //       ),
  //       h2: ({ children }: any) => (
  //         <h2 className="xs:text-sm md:text-xl font-bold">{children}</h2>
  //       ),
  //       normal: ({ children }: any) => (
  //         <p className="xs:text-sm md:text-xl font-bold">{children}</p>
  //       ),
  //     },
  //     marks: {
  //       textColor: ({ children, markKey, value }: any) => {
  //         console.log("Mark props:", { children, markKey, value });
  //         return <span style={{ color: value.value }}>{children}</span>;
  //       },
  //     },
  //   };
  const components = {
    block: {
      h1: ({ children }: any) => (
        <h1 className="text-white text-2xl 2xs:text-3xl lg:text-4xl font-bold">
          {children}
        </h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-white text-lg 2xs:text-2xl lg:text-3xl font-bold">
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

  //   return (
  //     <div className="absolute inset-0 z-50 flex flex-col justify-center items-start p-8">
  //       <div className="p-4 absolute inset-0 left-[10%] right-[10%] flex flex-col justify-center items-center font-black text-white scale-[1.0] 2xs:inset-[10%] 2xs:right-[30%] 2xs:scale-[1.2] sm:inset-[20%] sm:scale-[1.5] md:inset-[25%] md:scale-[1.8] lg:inset-[30%] lg:scale-[2.0] xl:inset-[32.5%] xl:scale-[2.5] 2xl:inset-[35%] 2xl:scale-[2.75] 3xl:inset-[37.5%] 3xl:scale-[3]">
  //         <div className="w-fit bg-black/40 p-6 rounded-lg">
  //           <PortableText value={text} components={components} />
  //         </div>
  //         <Link
  //           href="/categories/sale/january-gifts"
  //           className="mt-8 mr-auto px-8 py-2 text-white text-center font-black rounded-lg transition-all"
  //           style={{ backgroundColor: buttonColor }}
  //         >
  //           SEE NOW
  //         </Link>
  //       </div>
  //     </div>
  //   );
  return (
    <div className="absolute inset-0 flex items-center">
      <div className="w-[75%] md:w-[70%] lg:w-[60%] mx-auto flex justify-center">
        <div className="w-fit bg-black/40 p-4 md:p-6 rounded-lg">
          <PortableText value={text} components={components} />
          <div className="flex justify-center">
            <Link
              href="/categories/sale/january-gifts"
              className="2xs:text-2xl inline-block mt-6 ml-auto mr-auto px-6 py-2 text-white font-bold rounded-lg"
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
