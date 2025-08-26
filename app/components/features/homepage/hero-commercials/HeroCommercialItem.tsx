import Image from "next/image";
import { imageUrl, heroImageUrl } from "@/lib/imageUrl";
import TextCommercial from "@/app/components/ui/commercials/textCommercial";
import ProductsCommercial from "@/app/components/ui/commercials/productCommercial";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";

type ProductDescription = NonNullable<
  NonNullable<
    GET_COMMERCIALS_BY_FEATURE_QUERYResult[0]["products"]
  >[0]["description"]
>;

type SlideProps = {
  commercial: GET_COMMERCIALS_BY_FEATURE_QUERYResult[number];
  index: number;
};

type ProductVerified = {
  _id: string;
  brand: string;
  name: string;
  description: ProductDescription;
  price: number;
  image: string;
};

const HeroCommercialItem = async ({ commercial, index }: SlideProps) => {
  const { variant, products, text, image, sale } = commercial;

  const productsVerified = products?.filter(
    (product): product is ProductVerified =>
      Boolean(
        product?.brand &&
          product?.price &&
          product?.image &&
          product?.description
      )
  );

  if (!image) return null;

  const isFirstSlide = index === 0;
  const blurUrl = imageUrl(image).width(20).blur(10).quality(10).url();

  const discount = sale?.discount || null;
  const ctaLink = commercial.ctaLink || null;

  return (
    <div className="h-full relative flex-[0_0_100%]">
      <Image
        src={heroImageUrl(image).url()}
        priority={isFirstSlide}
        loading={isFirstSlide ? "eager" : "lazy"}
        fetchPriority={isFirstSlide ? "high" : "auto"}
        width={1920}
        height={1080}
        sizes="100vw"
        style={{ objectPosition: "center" }}
        className={`absolute inset-0 w-full h-full object-cover ${
          isFirstSlide ? "hero-image" : ""
        }`}
        quality={85}
        placeholder="blur"
        blurDataURL={blurUrl}
        alt={commercial.title || "Hero commercial"}
      />
      {variant === "text" && text ? (
        <TextCommercial text={text} ctaLink={ctaLink} />
      ) : (
        productsVerified && (
          <ProductsCommercial
            products={productsVerified}
            discount={discount}
            text={text}
            ctaLink={ctaLink}
          />
        )
      )}
    </div>
  );
};

export default HeroCommercialItem;
