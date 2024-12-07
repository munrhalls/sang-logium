"use client";

import Image from "next/image";
import imageUrl from "@/lib/imageUrl";
import { useState } from "react";
import { Product } from "@/sanity.types";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const ProductPageGallery = ({ product }: { product: Product }) => {
  const [currentImage, setCurrentImage] = useState<string>(
    imageUrl(product.image as SanityImageSource).url()
  );
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const handleMouseEnter = (url: string) => {
    setHoveredImage(url);
  };

  const handleMouseLeave = () => {
    setHoveredImage(null);
  };

  const handleClick = (url: string) => {
    setCurrentImage(url);
  };

  return (
    <div>
      {product.image && (
        <Image
          src={hoveredImage || currentImage}
          alt={product.name ?? "Product image"}
          fill
          className="object-contain transition-transform duration-300 hover:scale-105"
        />
      )}

      <div className="flex mt-4 space-x-2">
        {product.gallery &&
          product.gallery.map((img, index) => {
            const imgUrl = imageUrl(img as SanityImageSource).url();
            return (
              <div key={index} className="relative">
                <Image
                  src={imgUrl}
                  alt={`Thumbnail ${index + 1}`}
                  width={50}
                  height={50}
                  className={`cursor-pointer border-2 ${
                    currentImage === imgUrl
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onMouseEnter={() => handleMouseEnter(imgUrl)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(imgUrl)}
                />
                {currentImage === imgUrl && (
                  <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none"></div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ProductPageGallery;
