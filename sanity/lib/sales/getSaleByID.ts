import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getSaleById = async (saleId: string) => {
  const SALE_BY_ID_QUERY = defineQuery(`
    *[_type == "sale" && _id == $saleId]{
      name,
      "slug": slug.current,
      validFrom,
      validUntil,
      isActive,
      description,
      "image": image.asset->url,
      category->{
        name,
        "slug": slug.current,
        "products": *[_type=='product' && categoryPath == ^.metadata.path]{
          name,
          "slug": slug.current,
          image,
          defaultPrice
        }
      }
    }
  `);

  try {
    const sale = await sanityFetch({
      query: SALE_BY_ID_QUERY,
      params: {
        saleId,
      },
    });

    return sale.data || null;
  } catch (err) {
    console.error("Fetching sale by ID failed: ", err);
    return null;
  }
};
