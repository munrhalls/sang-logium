import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom", // Simulates browser
    globals: true, // Keeps 'describe', 'it', 'expect' available globally like Jest
  },
});
