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
  source: {
    define: {
      // Temporary workaround for https://github.com/napi-rs/napi-rs/issues/2867
      "process.env.NODE_DEBUG_NATIVE": false,
    },
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
});
