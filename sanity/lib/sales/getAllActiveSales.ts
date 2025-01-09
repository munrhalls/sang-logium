import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllActiveSales = async () => {
  const GET_ACTIVE_SALES_QUERY = defineQuery(`
      *[_type == "sale" && isActive == true] {
        _id,
        title,
        "slug": slug.current,
        discount,
        validFrom,
        validUntil,
        isActive
      }
    `);

  try {
    const sales = await sanityFetch({
      query: GET_ACTIVE_SALES_QUERY,
    });

    return sales.data || [];
  } catch (err) {
    console.error("Error fetching active sales: ", err);
  }
};
