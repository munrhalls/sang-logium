import geoapifyEnv from './geoapifyEnv';
export const baseUrl = 'https:
export function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
}
export function getDefaultParams(): Record<string, string | number> {
  return {
    apiKey: geoapifyEnv.getApiKey(),
    format: 'json',
    limit: 5
  };
}
