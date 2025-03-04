export default function parseUrlToCategoryPath(url) {
  const pathOnly = url.split("?")[0];

  const cleanPath = pathOnly.replace(/^\/products\//, "");

  return cleanPath;
}
