"use client";

import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { simplerColorInput } from "sanity-plugin-simpler-color-input";
// import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";

const sanityConfig = defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: [...schema.types],
  },
  plugins: [
    structureTool({ structure }),
    simplerColorInput({
      defaultColorFormat: "rgba",
      defaultColorList: [
        { label: "Light", value: "#ffffff" },
        { label: "Dark", value: "#333333" },
        { label: "Brand", value: "#ca786d" },
        { label: "Accent", value: "#626754" },
        { label: "Orange", value: "#CF8226" },
        { label: "HighlightOrange", value: "#e0ad1f" },
        { label: "Custom...", value: "custom" },
      ],
      enableSearch: true,
    }),
    // visionTool(),
  ],
});

export default sanityConfig;
