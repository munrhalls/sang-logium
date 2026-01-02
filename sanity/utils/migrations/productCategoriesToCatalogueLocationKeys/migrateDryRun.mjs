import client from "./../../getClient.mjs"; // ✅ Path corrected

const manualOverrides = {
  // --- PREVIOUS FIXES ---
  bluetooth: "bluetooth-speakers",
  bookshelf: "bookshelf-speakers",
  outdoor: "outdoor-speakers",
  subwoofers: "subwoofers",
  dacs: "dacs-digital-to-analog-converters",
  amps: "amplifiers",
  preamps: "preamps",
  receivers: "receivers",
  turntables: "turntables",
  "cd-players": "cd-players",
  cables: "audio-cables",
  stands: "speaker-stands",
  mounts: "wall-mounts",
  "media-players-and-streamers": "digital-audio-players",
  "portable-dacs": "portable-dacs-and-amps",
  "headphone-amps": "headphone-amplifiers",
  "power-strips": "power-management",
  "tips-and-ear-pads": "replacement-parts",
  "wireless-speakers": "powered-speakers",

  // --- FINAL FIX (V6) ---
  "floor-standing": "floor-standing-speakers",
};

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function buildMenuMap(nodes, map = new Map()) {
  if (!nodes) return map;
  for (const node of nodes) {
    if (node.slug?.current) map.set(node.slug.current, node._key);
    if (node.children) buildMenuMap(node.children, map);
  }
  return map;
}

async function runDryRun() {
  console.log("🚀 Starting Full Catalog Dry Run (V6 - The Clean Sweep)...");

  try {
    const catalogueDoc = await client.fetch(`*[_id == "catalogue"][0]`);
    if (!catalogueDoc) throw new Error("Catalogue missing!");

    const menuMap = buildMenuMap(catalogueDoc.catalogue || []);
    const allProducts = await client.fetch(
      `*[_type == "product" && defined(categoryPath)] { _id, name, categoryPath }`
    );

    console.log(`📦 Analyzing ${allProducts.length} products...`);

    const readyToMigrate = [];
    const failures = [];

    for (const product of allProducts) {
      const legacyPaths = product.categoryPath || [];
      const proposedKeys = [];

      for (const rawPath of legacyPaths) {
        if (typeof rawPath !== "string") continue;

        const leaf = rawPath.split("/").pop().toLowerCase();

        let key = menuMap.get(manualOverrides[leaf]);
        if (!key) key = menuMap.get(slugify(leaf));
        if (!key) key = menuMap.get(slugify(rawPath.replace(/\//g, "-")));

        if (key) proposedKeys.push(key);
      }

      if (proposedKeys.length > 0) {
        readyToMigrate.push({ id: product._id });
      } else {
        failures.push({ name: product.name, legacyData: legacyPaths });
      }
    }

    console.log(
      `✅ Ready: ${readyToMigrate.length} | ❌ Failures: ${failures.length}`
    );

    if (failures.length > 0) {
      console.log(
        "⚠️ Remaining Failures:",
        JSON.stringify(failures.slice(0, 5), null, 2)
      );
    } else {
      console.log("✨ 100% MATCH! Protocol Check 1 Passed.");
      console.log("👉 NEXT STEP: Create Backup (Step 2 of Protocol)");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

runDryRun();
