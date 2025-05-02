/**
 * Geoapify Address Autocomplete API environment configuration
 * 
 * This module provides secure access to the Geoapify API key from environment variables.
 * It is designed specifically for client-side Next.js components that will use
 * the address autocomplete functionality.
 */

/**
 * Get the Geoapify API key from environment variables
 * 
 * @returns The Geoapify API key
 * @throws Error if the API key is not configured
 */
export function getGeoapifyApiKey(): string {
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_GEOAPIFY_API_KEY is not configured in environment variables');
  }

  return apiKey;
}

/**
 * Check if the Geoapify API key is configured
 * 
 * @returns Boolean indicating whether the API key is available
 */
export function isGeoapifyApiKeyConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
}

export default {
  getApiKey: getGeoapifyApiKey,
  isApiKeyConfigured: isGeoapifyApiKeyConfigured
};