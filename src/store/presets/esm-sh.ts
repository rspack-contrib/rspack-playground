import { RSPACK_CONFIG } from "../common";
import type { SourcePreset } from ".";

const preset: SourcePreset = {
  name: "ESM SH",
  files: [
    {
      filename: RSPACK_CONFIG,
      text: `import * as rspack from "@rspack/core"

export default {
  mode: "development",
  devtool: false,
	entry: {
		main: "./index.js"
	},
  plugins: [
    new rspack.BrowserHttpImportPlugin(),
    new rspack.BannerPlugin({
      banner: 'hello world',
    }),
  ],
  experiments: {
    buildHttp: {
      allowedUris: ['https://'],
    },
  },
};`,
    },
    {
      filename: "index.js",
      text: `import isOdd from "is-odd"
console.log(isOdd(42))`,
    },
  ],
};

export default preset;
