import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import TextCommercial from "./staticTextCommercial";
import ProductsCommercial from "./staticProductsCommercial";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";
import Link from "next/link";

type SlideProps = {
  commercial: GET_COMMERCIALS_BY_FEATURE_QUERYResult[number];
  index: number;
};

type ProductVerified = {
  _id: string;
  name: string;
  price: number;
  image: string;
};

const Slide = ({ commercial, index }: SlideProps) => {
  const { image, sale, products, text } = commercial;

  const productsVerified = products?.filter(
    (product): product is ProductVerified =>
      Boolean(product?.name && product?.price && product?.image)
  );

  const buttonColor = () => {
    if (!text) return "#CF8226";
    const firstColorMark = text[0]?.markDefs?.find(
      (mark) => mark._type === "textColor"
    );
    return firstColorMark?.value || "#CF8226";
  };

  if (!image) return null;

  const discount = sale?.discount || null;

  return (
    <div
      className="z-10 absolute top-0 bottom-0"
      style={{
        width: "100%",
        transform: `translateX(${index * 100}%)`,
      }}
    >
      <div className="relative h-full w-full">
        <Image
          src={imageUrl(image).url()}
          width={1920}
          height={1080}
          style={{ objectPosition: "80% 0%" }}
          className="absolute inset-0 w-full h-full object-cover"
          quality={85}
          sizes="100vw"
          alt={commercial.title || "Sale"}
        />
        <div className="grid md:grid-cols-[1fr_10fr_1fr] md:align-content-center">
          {text && text.length > 0 && <TextCommercial text={text} />}

          {productsVerified && (
            <ProductsCommercial
              products={productsVerified}
              discount={discount}
            />
          )}
          <Link
            href="asdasaxzc"
            prefetch={true}
            className=""
            style={{ backgroundColor: `${buttonColor}` }}
          >
            SEE MORE
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Slide;
