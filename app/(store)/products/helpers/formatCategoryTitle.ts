export default function formatCategoryTitle(leaf) {
  // Replace hyphens with spaces
  let title = leaf.replace(/-/g, " ");

  // Capitalize first letter of each word
  title = title.replace(/\b\w/g, (match) => match.toUpperCase());

  // Handle acronyms with possible plurals
  title = title.replace(
    /\b(cd|dvd|tv|hd|ssd|usb|hdmi|rca|dac)(s?)\b/gi,
    (match, acronym, plural) => acronym.toUpperCase() + plural.toLowerCase()
  );

  return title;
}
