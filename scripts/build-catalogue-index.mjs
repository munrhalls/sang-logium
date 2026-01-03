import { createClient } from "next-sanity";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

// Load environment variables for the build script
dotenv.config({ path: ".env" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false, // Always fresh data for build
  apiVersion: "2023-05-03",
});

async function buildCatalogueIndex() {
  console.log("🏗️  Building Catalogue Virtual File System...");

  try {
    // 1. Fetch the Tree
    const catalogue = await client.fetch(`*[_id == "catalogue"][0].catalogue`);
    if (!catalogue) throw new Error("No catalogue found in Sanity!");

    // 2. Flatten into Look-Up Tables (O(1))
    const urlMap = {}; // "/headphones/wired" -> "key_123"
    const idMap = {}; // "key_123" -> { title: "Wired", url: "...", breadcrumbs: [] }

    function traverse(nodes, parentPath = [], parentBreadcrumbs = []) {
      if (!nodes) return;

      for (const node of nodes) {
        if (!node.slug?.current) continue;

        // 1. Normalize Type
        if (!node.itemType && node.itemType) node.itemType = node.itemType;
        if (!node.itemType) node.itemType = "link";

        const isHeader = node.itemType === "header";
        const currentSlug = node.slug.current;

        // 2. Calculate Path
        // If it's a header, we IGNORE it for the URL path.
        // The children will inherit the *current* parentPath directly.
        const pathSegments = isHeader
          ? parentPath
          : [...parentPath, currentSlug];

        const urlString = pathSegments.join("/");

        // 3. Calculate Breadcrumbs
        // We usually skip headers in breadcrumbs too, so the trail is "Home > Headphones > Wired"
        const nextBreadcrumbs = isHeader
          ? parentBreadcrumbs
          : [
              ...parentBreadcrumbs,
              { label: node.title, url: `/shop/${urlString}` },
            ];

        // 4. Populate Maps
        // Only Links get a URL entry
        if (!isHeader) {
          urlMap[urlString] = node._key;
        }

        idMap[node._key] = {
          title: node.title,
          // Headers get '#' so they don't link anywhere
          url: isHeader ? "#" : `/shop/${urlString}`,
          slug: currentSlug,
          breadcrumbs: nextBreadcrumbs,
          children: node.children?.map((c) => c._key) || [],
          itemType: node.itemType, // Useful to have in frontend
        };

        // 5. Recurse
        // CRITICAL: Pass 'pathSegments', not '[...parentPath, currentSlug]'
        traverse(node.children, pathSegments, nextBreadcrumbs);
      }
    }

    traverse(catalogue);

    // 3. Write to File
    const output = {
      generatedAt: new Date().toISOString(),
      urlMap,
      idMap,
      tree: catalogue, // 👈 CRITICAL FIX: Added the full tree here
    };

    // ⚠️ Updated path to '/data' to match your @/data import alias
    const outputPath = path.join(process.cwd(), "data", "catalogue-index.json");

    // Ensure directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(output, null, 2));

    console.log(
      `✅ Index Built! Mapped ${Object.keys(idMap).length} categories.`
    );
    console.log(`📂 Saved to: src/data/catalogue-index.json`);
  } catch (error) {
    console.error("❌ Build Failed:", error);
    process.exit(1);
  }
}

buildCatalogueIndex();
