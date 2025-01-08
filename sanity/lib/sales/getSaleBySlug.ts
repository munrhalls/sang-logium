import { client } from "../client";
import groq from "groq";

export async function getSaleBySlug(slug: string) {
  return client.fetch(
    groq`*[_type == "sale" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      discount,
      validFrom,
      validUntil,
      isActive,
      "products": products[]->{
        _id,
        name,
        "slug": slug.current,
        price,
        description,
        "mainImage": images[0].asset->url,
        "category": category->name
      }
    }`,
    { slug }
  );
}

export async function getAllActiveSales() {
  return client.fetch(
    groq`*[_type == "sale" && isActive == true]{
      "slug": slug.current
    }`
  );
}
