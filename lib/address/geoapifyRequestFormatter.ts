/**
 * Geoapify Address Autocomplete API - Request Formatter
 * 
 * This module provides functions to format requests for the Geoapify Address
 * Autocomplete API. It combines user input with API configuration and country
 * filters to create properly formatted request URLs.
 */

import { baseUrl, getDefaultParams } from './geoapifyConfig';
import { getCountryFilters, getGBFilter, getPLFilter } from './geoapifyRegionFilters';

/**
 * Formats a request to the Geoapify Address Autocomplete API
 * 
 * @param text - The address text to search for
 * @param countryCode - Optional country code to restrict results ('gb' or 'pl')
 * @returns A complete, ready-to-use request URL
 * @throws Error if the text input is empty or invalid
 */
export function formatAutocompleteRequest(
  text: string, 
  countryCode?: 'gb' | 'pl'
): string {
  // Validate and sanitize input text
  if (!text || typeof text !== 'string') {
    throw new Error('Address text is required and must be a string');
  }

  const sanitizedText = text.trim();
  
  if (sanitizedText.length === 0) {
    throw new Error('Address text cannot be empty');
  }

  // Get base parameters
  const params = {
    ...getDefaultParams(),
    text: sanitizedText
  };

  // Add country filters if specified
  if (countryCode) {
    const countryFilter = countryCode.toLowerCase() === 'gb' 
      ? getGBFilter() 
      : getPLFilter();
    
    Object.assign(params, countryFilter);
  } else {
    // If no specific country is requested, use the combined filter
    Object.assign(params, getCountryFilters());
  }

  // Create URL with parameters
  const searchParams = new URLSearchParams();
  
  // Add all parameters to the URL
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, value.toString());
  });

  // Return the complete URL
  return `${baseUrl}?${searchParams.toString()}`;
}

/**
 * Example usage:
 * 
 * ```typescript
 * // Get autocomplete suggestions for "London" in Great Britain only
 * const requestUrl = formatAutocompleteRequest('London', 'gb');
 * 
 * // Get autocomplete suggestions for "Warsaw" in Poland only
 * const requestUrl = formatAutocompleteRequest('Warsaw', 'pl');
 * 
 * // Get autocomplete suggestions for "High Street" in both GB and PL
 * const requestUrl = formatAutocompleteRequest('High Street');
 * ```
 */