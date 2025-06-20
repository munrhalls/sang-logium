import { Address } from "@/sanity/lib/profiles/profileTypes";

const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
const GEOAPIFY_API_URL = "https://api.geoapify.com/v1/geocode/autocomplete";

interface GeoapifyFeature {
  formatted: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  lat: number;
  lon: number;
  result_type: string;
  address_line1?: string;
  address_line2?: string;
  country_code?: string;
}

interface GeoapifyResponse {
  results: GeoapifyFeature[];
}

export async function searchAddresses(query: string): Promise<Address[]> {
  if (!GEOAPIFY_API_KEY) {
    throw new Error("Address search is not configured");
  }

  if (!query?.trim()) {
    return [];
  }

  const params = new URLSearchParams({
    text: query,
    apiKey: GEOAPIFY_API_KEY,
    format: "json",
    limit: "5",
    country: "gb",
    type: "city",
    filter: "countrycode:gb",
  });

  try {
    const response = await fetch(`${GEOAPIFY_API_URL}?${params}`);
    const data: GeoapifyResponse = await response.json();

    return data.results
      .filter((feature) => feature.country_code === "gb")
      .map((feature) => ({
        streetAddress: feature.address_line1 ?? "",
        city: feature.city ?? "",
        state: feature.state ?? "",
        postalCode: feature.postcode ?? "",
        country: feature.country ?? "",
        formattedAddress: feature.formatted,
        lat: feature.lat,
        lon: feature.lon,
      }));
  } catch (error) {
    console.error("Error searching addresses:", error);
    throw new Error("Failed to search addresses");
  }
}
