/**
 * Geoapify Address Autocomplete API configuration
 * 
 * This module provides the base configuration for making requests to the
 * Geoapify Address Autocomplete API service. It imports the API key from
 * the environment module and sets up common parameters.
 */

import geoapifyEnv from './geoapifyEnv';

/**
 * Base URL for the Geoapify Autocomplete API
 */
export const baseUrl = 'https://api.geoapify.com/v1/geocode/autocomplete';

/**
 * Creates and returns the request headers for Geoapify API requests
 * 
 * @returns The headers object for API requests
 */
export function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
}

/**
 * Returns the default parameters for Geoapify Autocomplete API
 * 
 * @returns Object containing default API parameters
 */
export function getDefaultParams(): Record<string, string | number> {
  return {
    apiKey: geoapifyEnv.getApiKey(),
    format: 'json',
    limit: 5
  };
}

/**
 * Example usage:
 * 
 * ```
 * const url = `${baseUrl}?${new URLSearchParams({
 *   ...getDefaultParams(),
 *   text: userInput
 * })}`;
 * 
 * const response = await fetch(url, { headers: getHeaders() });
 * ```
 */