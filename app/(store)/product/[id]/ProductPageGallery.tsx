"use client";

import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import { useState } from "react";
import { Product } from "@/sanity.types";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

const ProductPageGallery = ({ product }: { product: Product }) => {
  const [currentImage, setCurrentImage] = useState<string>(
    imageUrl(product.image as SanityImageSource).url(),
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleClick = (url: string, index: number) => {
    setCurrentImage(url);
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    if (product.gallery && product.gallery.length > 0) {
      const newIndex =
        currentIndex === 0 ? product.gallery.length - 1 : currentIndex - 1;
      const imgUrl = imageUrl(
        product.gallery[newIndex] as SanityImageSource,
      ).url();
      setCurrentImage(imgUrl);
      setCurrentIndex(newIndex);
    }
  };

  const handleNext = () => {
    if (product.gallery && product.gallery.length > 0) {
      const newIndex =
        currentIndex === product.gallery.length - 1 ? 0 : currentIndex + 1;
      const imgUrl = imageUrl(
        product.gallery[newIndex] as SanityImageSource,
      ).url();
      setCurrentImage(imgUrl);
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="max-h-[700px] grid justify-center sm:place-content-center sm:row-start-1 sm:row-span-1 sm:col-start-1 sm:col-span-1">
      {product.image && (
        <Image
          src={currentImage}
          alt={product.name ?? "Product image"}
          loading="lazy"
          quality="90"
          height={500}
          width={500}
          className="aspect-square"
        />
      )}

      <div className="grid grid-flow-col place-content-start gap-2 mt-4">
        {product.gallery && (
          <FaArrowLeft
            className="place-self-center cursor-pointer"
            onClick={handlePrev}
          />
        )}
        {product.gallery &&
          product.gallery.map((img, index) => {
            const imgUrl = imageUrl(img as SanityImageSource).url();

            return (
              <div key={index} className="">
                <Image
                  src={imgUrl}
                  loading="lazy"
                  alt={`Thumbnail ${index + 1}`}
                  width={50}
                  height={50}
                  className={`aspect-square cursor-pointer border-2 rounded-sm ${
                    currentImage === imgUrl
                      ? "border-slate-950"
                      : "border-slate-400"
                  }`}
                  onClick={() => handleClick(imgUrl, index)}
                />
              </div>
            );
          })}
        {product.gallery && (
          <FaArrowRight
            className="place-self-center cursor-pointer"
            onClick={handleNext}
          />
        )}
      </div>
    </div>
  );
};

export default ProductPageGallery;
