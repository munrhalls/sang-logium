import { baseUrl, getDefaultParams } from './geoapifyConfig';
import { getCountryFilters, getGBFilter, getPLFilter } from './geoapifyRegionFilters';
export function formatAutocompleteRequest(
  text: string, 
  countryCode?: 'gb' | 'pl'
): string {
  if (!text || typeof text !== 'string') {
    throw new Error('Address text is required and must be a string');
  }
  const sanitizedText = text.trim();
  if (sanitizedText.length === 0) {
    throw new Error('Address text cannot be empty');
  }
  const params = {
    ...getDefaultParams(),
    text: sanitizedText
  };
  if (countryCode) {
    const countryFilter = countryCode.toLowerCase() === 'gb' 
      ? getGBFilter() 
      : getPLFilter();
    Object.assign(params, countryFilter);
  } else {
    Object.assign(params, getCountryFilters());
  }
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, value.toString());
  });
  return `${baseUrl}?${searchParams.toString()}`;
}
