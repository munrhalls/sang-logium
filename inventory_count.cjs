const inventory = require("./inventory_export.json");
const counts = {};

inventory.forEach((item) => {
  const path = item.categoryPath || "Uncategorized";
  counts[path] = (counts[path] || 0) + 1;
});

const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
console.log(sorted);
