"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "@sanity-typed/types";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { simplerColorInput } from "sanity-plugin-simpler-color-input";
import { InferSchemaValues } from "@sanity-typed/types";

const sanityConfig = defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
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
  ],
});

export default sanityConfig;
export type SanityValues = InferSchemaValues<typeof sanityConfig>;
