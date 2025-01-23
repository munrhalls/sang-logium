import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import TextCommercial from "./staticTextCommercial";
import ProductsCommercial from "./staticProductsCommercial";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";

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
  const { variant, products, text, image, sale } = commercial;

  const productsVerified = products?.filter(
    (product): product is ProductVerified =>
      Boolean(product?.name && product?.price && product?.image)
  );

  console.log(index);

  if (!image) return null;

  const discount = sale?.discount || null;
  {
  }
  return (
    <div
      className="z-30 absolute top-0 bottom-0"
      style={{
        width: "100%",
        transform: `translateX(${index * 100}%)`,
      }}
    >
      <div className="relative h-full w-full md:grid md:place-content-center">
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

        <div className="h-full grid md:grid-cols-[1fr_10fr_1fr] md:place-content-center md:[grid-template-areas:'empty_content_empty'] px-3 py-3">
          <div className="z-30 md:[grid-area:content]">
            {variant === "text" && text ? (
              <TextCommercial text={text} />
            ) : (
              productsVerified && (
                <ProductsCommercial
                  products={productsVerified}
                  discount={discount}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Slide;
