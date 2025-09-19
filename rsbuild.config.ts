import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: "Rspack Playground",
    favicon: "./public/favicon-128x128.png",
    appIcon: {
      name: "Rspack Playground",
      icons: [
        {
          src: "public/favicon-128x128.png",
          size: 128,
        },
      ],
    },
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
});
