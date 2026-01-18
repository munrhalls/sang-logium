import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
// import { colorInput } from "@sanity/color-input";
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
    // colorInput({
    //   colors: [
    //     { title: "Light", value: "#ffffff" },
    //     { title: "Dark", value: "#333333" },
    //     { title: "Brand", value: "#ca786d" },
    //     { title: "Accent", value: "#626754" },
    //     { title: "Orange", value: "#CF8226" },
    //     { title: "HighlightOrange", value: "#e0ad1f" },
    //   ],
    // }),

    // visionTool(),
    // colorInput(),
  ],
});

export default sanityConfig;
