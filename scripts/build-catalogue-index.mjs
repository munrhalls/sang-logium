import { createClient } from "next-sanity";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

// Load environment variables for the build script
dotenv.config({ path: ".env.local" });

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

        // Build URL: /parent/child
        const currentSlug = node.slug.current;
        // Handle root vs nested
        const fullPath = [...parentPath, currentSlug].join("/");
        const url = `/${fullPath}`;

        // Breadcrumbs for UI
        const breadcrumbs = [
          ...parentBreadcrumbs,
          { label: node.title, url: url },
        ];

        // A. URL Look-up (Routing)
        urlMap[url] = node._key;

        // B. ID Look-up (Product resolution)
        idMap[node._key] = {
          title: node.title,
          url: url,
          slug: currentSlug,
          breadcrumbs: breadcrumbs,
          children: node.children?.map((c) => c._key) || [],
        };

        // Recurse
        traverse(node.children, [...parentPath, currentSlug], breadcrumbs);
      }
    }

    traverse(catalogue);

    // 3. Write to File
    const output = {
      generatedAt: new Date().toISOString(),
      urlMap,
      idMap,
    };

    const outputPath = path.join(
      process.cwd(),
      "app",
      "data",
      "catalogue-index.json"
    );
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
