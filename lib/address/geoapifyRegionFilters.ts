export type CountryFilterParams = {
  filter?: string;
  bias?: string;
};
export function getGBFilter(): CountryFilterParams {
  return {
    filter: 'countrycode:gb',
    bias: 'countrycode:gb'
  };
}
export function getPLFilter(): CountryFilterParams {
  return {
    filter: 'countrycode:pl',
    bias: 'countrycode:pl'
  };
}
export function getCountryFilters(): CountryFilterParams {
  return {
    filter: 'countrycode:gb,pl'
  };
}
