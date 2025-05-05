export function getGeoapifyApiKey(): string {
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_GEOAPIFY_API_KEY is not configured in environment variables');
  }
  return apiKey;
}
export function isGeoapifyApiKeyConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
}
export default {
  getApiKey: getGeoapifyApiKey,
  isApiKeyConfigured: isGeoapifyApiKeyConfigured
};