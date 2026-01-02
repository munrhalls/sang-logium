import client from "./../../getClient.mjs";

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
  // "cables": "audio-cables", <--- REMOVED (Now handled by Smart Rules)
  stands: "speaker-stands",
  mounts: "wall-mounts",
  "media-players-and-streamers": "digital-audio-players",
  "portable-dacs": "portable-dacs-and-amps",
  "headphone-amps": "headphone-amplifiers",
  "power-strips": "power-management",
  "tips-and-ear-pads": "replacement-parts",
  "wireless-speakers": "powered-speakers",
  "floor-standing": "floor-standing-speakers",
};

// 🧠 SMART RULES: Context-aware mapping based on Product Name
const SMART_RULES = {
  cables: [
    { contains: "power", target: "power-cables" },
    { contains: "hdmi", target: "hdmi-cables" },
    { contains: "usb", target: "usb-cables" },
    { contains: "ethernet", target: "ethernet-cables" },
    { contains: "rca", target: "rca-cables" },
    { contains: "headphone", target: "headphone-cables" },
    // Default fallback if no keywords match:
    { default: "audio-cables" },
  ],
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
  console.log("🚀 Starting Full Catalog Dry Run (V7 - Smart Logic Check)...");

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

    // Log to track how smart rules are performing
    const smartLog = {};

    for (const product of allProducts) {
      const legacyPaths = product.categoryPath || [];
      const proposedKeys = [];

      for (const rawPath of legacyPaths) {
        if (typeof rawPath !== "string") continue;

        const leaf = rawPath.split("/").pop().toLowerCase();
        let key = null;
        let smartTarget = null;
        let isSmartMatch = false;

        // 1. SMART CHECK (Priority)
        if (SMART_RULES[leaf]) {
          const productName = product.name.toLowerCase();
          const rule = SMART_RULES[leaf].find(
            (r) => r.default || productName.includes(r.contains)
          );

          if (rule) {
            smartTarget = rule.target || rule.default;
            key = menuMap.get(smartTarget);
            isSmartMatch = true;
          }
        }

        // 2. DICTIONARY CHECK (Fallback)
        if (!key) key = menuMap.get(manualOverrides[leaf]);

        // 3. FUZZY CHECK
        if (!key) key = menuMap.get(slugify(leaf));

        // 4. WHOLE PATH CHECK
        if (!key) key = menuMap.get(slugify(rawPath.replace(/\//g, "-")));

        if (key) {
          proposedKeys.push(key);
          // Collect data for the report
          if (isSmartMatch) {
            if (!smartLog[smartTarget]) smartLog[smartTarget] = [];
            smartLog[smartTarget].push(product.name);
          }
        }
      }

      if (proposedKeys.length > 0) {
        readyToMigrate.push({ id: product._id });
      } else {
        failures.push({ name: product.name, legacyData: legacyPaths });
      }
    }

    console.log(
      `\n✅ Ready: ${readyToMigrate.length} | ❌ Failures: ${failures.length}`
    );

    // --- SMART LOGIC SUMMARY ---
    const smartKeys = Object.keys(smartLog);
    if (smartKeys.length > 0) {
      console.log("\n🧠 Smart Logic Breakdown:");
      console.log("-----------------------------------------------");
      smartKeys.forEach((target) => {
        const items = smartLog[target];
        console.log(
          `👉 ${target.toUpperCase()}: ${items.length} products found`
        );
        // Show up to 3 examples
        items.slice(0, 3).forEach((name) => console.log(`      - ${name}`));
      });
      console.log("-----------------------------------------------");
    }

    if (failures.length > 0) {
      console.log(
        "⚠️ Remaining Failures:",
        JSON.stringify(failures.slice(0, 5), null, 2)
      );
    } else {
      console.log("\n✨ 100% MATCH! Protocol Check 1 Passed.");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

runDryRun();
