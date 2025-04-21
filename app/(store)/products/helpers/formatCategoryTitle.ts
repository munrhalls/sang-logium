export default function formatCategoryTitle(leaf: string) {
  let title = leaf.replace(/-/g, " ");

  title = title.replace(/\b\w/g, (match) => match.toUpperCase());

  title = title.replace(
    /\b(cd|dvd|tv|hd|ssd|usb|hdmi|rca|dac)(s?)\b/gi,
    (match, acronym, plural) => acronym.toUpperCase() + plural.toLowerCase()
  );

  return title;
}
