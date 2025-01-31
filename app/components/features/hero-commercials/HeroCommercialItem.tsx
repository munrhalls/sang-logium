import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import TextCommercial from "@/app/components/ui/commercials/textCommercial";
import ProductsCommercial from "@/app/components/ui/commercials/productCommercial";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";

type SlideProps = {
  commercial: GET_COMMERCIALS_BY_FEATURE_QUERYResult[number];
  index: number;
};

type ProductVerified = {
  _id: string;
  brand: string;
  price: number;
  image: string;
};

const HeroCommercialItem = async ({ commercial, index }: SlideProps) => {
  const { variant, products, text, image, sale } = commercial;

  const productsVerified = products?.filter(
    (product): product is ProductVerified =>
      Boolean(product?.brand && product?.price && product?.image)
  );

  if (!image) return null;

  const discount = sale?.discount || null;

  return (
    <>
      <Image
        src={imageUrl(image).url()}
        priority={index === 0}
        loading={index === 0 ? "eager" : "lazy"}
        width={1280}
        height={720}
        style={{ objectPosition: "80% 0%" }}
        className="absolute inset-0 w-full h-full object-cover"
        quality={80}
        sizes="100vw"
        alt={commercial.title || "Sale"}
      />
      {variant === "text" && text ? (
        <TextCommercial text={text} />
      ) : (
        productsVerified && (
          <ProductsCommercial
            products={productsVerified}
            discount={discount}
            text={text}
          />
        )
      )}
    </>
  );
};
export default HeroCommercialItem;
