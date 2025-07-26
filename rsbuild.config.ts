import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: 'Rspack REPL',
    appIcon: {
      name: 'Rspack REPL',
      icons: [
        {
          src: 'public/favicon-128x128.png',
          size: 128,
        },
      ],
    },
  },
});
