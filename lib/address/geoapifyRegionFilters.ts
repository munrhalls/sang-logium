/**
 * Geoapify Address Autocomplete API - Region Filters
 * 
 * This module provides functions to filter Geoapify Address Autocomplete API 
 * results to specific countries, specifically Great Britain and Poland.
 * 
 * These filters can be combined with the configuration module to restrict
 * the autocomplete suggestions to specific geographic regions.
 */

/**
 * Type definition for country filter parameters
 */
export type CountryFilterParams = {
  filter?: string;
  bias?: string;
};

/**
 * Get filter parameters for Great Britain (GB)
 * 
 * @returns Parameters to restrict results to Great Britain
 */
export function getGBFilter(): CountryFilterParams {
  return {
    filter: 'countrycode:gb',
    bias: 'countrycode:gb'
  };
}

/**
 * Get filter parameters for Poland (PL)
 * 
 * @returns Parameters to restrict results to Poland
 */
export function getPLFilter(): CountryFilterParams {
  return {
    filter: 'countrycode:pl',
    bias: 'countrycode:pl'
  };
}

/**
 * Get filter parameters to restrict results to either Great Britain or Poland
 * 
 * This uses the filter parameter to limit results to only these countries,
 * with both GB and PL included in the filter.
 *
 * @returns Parameters to restrict results to GB and PL
 */
export function getCountryFilters(): CountryFilterParams {
  return {
    filter: 'countrycode:gb,pl'
  };
}

/**
 * Example usage with the configuration module:
 * 
 * ```typescript
 * import { getDefaultParams } from './geoapifyConfig';
 * import { getCountryFilters } from './geoapifyRegionFilters';
 * 
 * const params = {
 *   ...getDefaultParams(),
 *   ...getCountryFilters(),
 *   text: userInput
 * };
 * 
 * // For specific country:
 * const gbOnlyParams = {
 *   ...getDefaultParams(),
 *   ...getGBFilter(),
 *   text: userInput
 * };
 * ```
 */