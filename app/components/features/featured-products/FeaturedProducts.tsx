import CarouselMultiSlide from "../../ui/carousel-multi-slide/carouselMultiSlide";
import SegmentTitle from "../../ui/segment-title/SegmentTitle";

// import Image from "next/image";
import Price from "../../ui/commercials/minor/price";
import BrandTitle from "../../ui/commercials/minor/brandTitle";
import ProductName from "../../ui/commercials/minor/productName";
// import Image from "next/image";

export default async function FeaturedProducts() {
  const keys: string[] = [];
  const image = { width: 300, height: 300, title: "Square (1:1)" };

  const prebuiltCommercials = Array.from({ length: 15 }).map(
    (_, index: number) => {
      keys.push(`featured ${index}`);
      return (
        <div
          key={index + "_Featured"}
          className="h-full w-full p-4 grid place-items-center relative "
        >
          <div className="h-full w-full max-w-[300px]  grid grid-rows-[auto_2fr_auto] border border-black">
            <BrandTitle brand="Sennheiser" />
            <div className="h-full ">
              <img
                src={`https://picsum.photos/${image.width}/${image.height}`}
                height={image.height}
                width={image.width}
                alt={image.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* <ProductImage
              src={`https://picsum.photos/${image.width}/${image.height}`}
              brand={"Sennheiser"}
            /> */}

            <ProductName
              name={
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquamomnis voluptatum eaque sed cumque repudiandae qui! ObcaecatiKV-3000."
              }
            />
            <Price price={159.99} priceColor={"blue"} />
          </div>
        </div>
      );
    }
  );

  return (
    <div className="w-full  grid grid-rows-[1fr_4fr]">
      <SegmentTitle title="Featured Collection" />
      <div className="h-full min-h-[400px] w-full ">
        <CarouselMultiSlide prebuiltSlides={prebuiltCommercials} keys={keys} />
      </div>
    </div>
  );
}
