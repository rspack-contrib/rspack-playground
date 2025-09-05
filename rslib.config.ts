import { defineConfig } from "@rslib/core";
export default defineConfig({
  source: {
    entry: {
      "service-worker": "./sw/service-worker.ts",
    },
  },
  output: {
    distPath: {
      root: "./public/preview",
    },
  },
  lib: [{ format: "esm", autoExtension: false }],
});
