import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllSales = async () => {
  const GET_ALL_SALES = defineQuery(`*[_type == "sale"] {
    _id,
    title,
    subtitle,
    slug,
    discountAmount,
    couponCode,
    validFrom,
    validUntil,
    isActive,
    image,
    ctaText,
    ctaLink,
  }`);

  try {
    const activeSales = await sanityFetch({
      query: GET_ALL_SALES,
      params: {},
    });

    return activeSales ? activeSales.data : [];
  } catch (err) {
    console.error("Error fetching sale: ", err);
    return [];
  }
};
