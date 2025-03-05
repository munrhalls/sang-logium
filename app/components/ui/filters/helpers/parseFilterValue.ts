export default function parseFilterValue(value) {
  if (!value) return undefined;

  try {
    // Try to parse as JSON for object values
    return JSON.parse(value);
  } catch (e) {
    // If not valid JSON, return as is
    return value;
  }
}
