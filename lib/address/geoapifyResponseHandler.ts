import { Address } from "@/sanity/lib/profiles/profileTypes";
export interface GeoapifyAddressResult {
  country?: string;
  country_code?: string;
  state?: string;
  county?: string;
  city?: string;
  postcode?: string;
  street?: string;
  housenumber?: string;
  formatted?: string;
  address_line1?: string;
  address_line2?: string;
  lat?: number;
  lon?: number;
  district?: string;
  timezone?: string;
  result_type?: string;
  rank?: {
    importance?: number;
    confidence?: number;
    match_type?: string;
  };
  place_id?: string;
}
export interface GeoapifyParsedQuery {
  text?: string;
  expected_type?: string;
}
export interface GeoapifyAutocompleteResponse {
  results: GeoapifyAddressResult[];
  query: {
    text: string;
    parsed: GeoapifyParsedQuery;
  };
}
export interface AddressResult extends Address {
  formattedAddress?: string;
  coordinates?: {
    longitude: number;
    latitude: number;
  };
}
export function parseAutocompleteResponse(response: any): AddressResult[] {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response format: response must be an object');
  }
  if (!Array.isArray(response.results)) {
    throw new Error('Invalid response format: missing results array');
  }
  if (response.results.length === 0) {
    return [];
  }
  return response.results.map((result: GeoapifyAddressResult): AddressResult => {
    const address: AddressResult = {
      streetAddress: formatStreetAddress(result),
      city: result.city || result.district || result.county || undefined,
      state: result.state || undefined,
      postalCode: result.postcode || undefined,
      country: result.country || undefined,
      formattedAddress: result.formatted || undefined
    };
    if (typeof result.lon === 'number' && typeof result.lat === 'number') {
      address.coordinates = {
        longitude: result.lon,
        latitude: result.lat
      };
    }
    return address;
  });
}
function formatStreetAddress(result: GeoapifyAddressResult): string | undefined {
  if (result.address_line1) {
    return result.address_line1;
  }
  if (!result.street) {
    return undefined;
  }
  return result.housenumber 
    ? `${result.housenumber} ${result.street}` 
    : result.street;
}
