const STORAGE_KEY = "pre_drawer_url";
export default function savePreDrawerUrl(url: string) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, url);
  }
}
