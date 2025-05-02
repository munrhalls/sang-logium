/**
 * Geoapify Address Autocomplete API - Response Handler
 * 
 * This module provides functions to parse and normalize responses from the
 * Geoapify Address Autocomplete API.
 */

import { Address } from "@/sanity/lib/profiles/profileTypes";

/**
 * Interface for an address result in the Geoapify API response
 */
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

/**
 * Interface for a parsed address query in the Geoapify API response
 */
export interface GeoapifyParsedQuery {
  text?: string;
  expected_type?: string;
}

/**
 * Interface for the Geoapify API autocomplete response
 */
export interface GeoapifyAutocompleteResponse {
  results: GeoapifyAddressResult[];
  query: {
    text: string;
    parsed: GeoapifyParsedQuery;
  };
}

/**
 * Enhanced address interface with coordinates
 */
export interface AddressResult extends Address {
  formattedAddress?: string;
  coordinates?: {
    longitude: number;
    latitude: number;
  };
}

/**
 * Parse and normalize a Geoapify Autocomplete API response
 *
 * @param response - The raw API response
 * @returns An array of normalized address objects
 * @throws Error if the response is invalid or empty
 */
export function parseAutocompleteResponse(response: any): AddressResult[] {
  // Validate response structure
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response format: response must be an object');
  }
  
  // Check if response has results array
  if (!Array.isArray(response.results)) {
    throw new Error('Invalid response format: missing results array');
  }
  
  // Handle empty results
  if (response.results.length === 0) {
    return [];
  }
  
  // Transform and normalize each result
  return response.results.map((result: GeoapifyAddressResult): AddressResult => {
    // Create normalized address object
    const address: AddressResult = {
      streetAddress: formatStreetAddress(result),
      city: result.city || result.district || result.county || undefined,
      state: result.state || undefined,
      postalCode: result.postcode || undefined,
      country: result.country || undefined,
      formattedAddress: result.formatted || undefined
    };
    
    // Add coordinates if available
    if (typeof result.lon === 'number' && typeof result.lat === 'number') {
      address.coordinates = {
        longitude: result.lon,
        latitude: result.lat
      };
    }
    
    return address;
  });
}

/**
 * Format street address from Geoapify result
 * 
 * @param result - Geoapify address result
 * @returns Formatted street address
 */
function formatStreetAddress(result: GeoapifyAddressResult): string | undefined {
  // If address_line1 is available, use it (contains street number and name)
  if (result.address_line1) {
    return result.address_line1;
  }
  
  // If no street provided, return undefined
  if (!result.street) {
    return undefined;
  }
  
  // Otherwise, combine housenumber and street if both available
  return result.housenumber 
    ? `${result.housenumber} ${result.street}` 
    : result.street;
}

/**
 * Example usage:
 * 
 * ```typescript
 * try {
 *   const apiResponse = await fetch(requestUrl).then(res => res.json());
 *   const addresses = parseAutocompleteResponse(apiResponse);
 *   // addresses is now an array of normalized address objects
 * } catch (error) {
 *   console.error('Failed to parse autocomplete response:', error);
 * }
 * ```
 */