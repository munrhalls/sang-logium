import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
const builder = imageUrlBuilder(client);
export const imageUrl = (source: SanityImageSource) => {
  return builder.image(source).auto("format").quality(85).fit("max");
};
export const heroImageUrl = (source: SanityImageSource) => {
  return imageUrl(source).width(1920).quality(85);
};
export const thumbnailImageUrl = (source: SanityImageSource) => {
  return imageUrl(source).width(400).quality(75);
};
export const brandImageUrl = (source: SanityImageSource) => {
  console.log("brand image url", source);
  return builder.image(source).auto("format").quality(85);
};
