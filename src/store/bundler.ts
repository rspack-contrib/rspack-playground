import { atom } from "jotai";
import { deserializeShareData } from "@/lib/share";

export const RSPACK_CONFIG = "rspack.config.js";
export const INITIAL_FILES: SourceFile[] = [
  {
    filename: RSPACK_CONFIG,
    text: `import * as rspack from "@rspack/browser"

export default {
  mode: "development",
  devtool: false,
	entry: {
		main: "./index.js"
	},
  plugins: [
    new rspack.BannerPlugin({
      banner: 'hello world',
    }),
  ],
};`,
  },
  {
    filename: "index.js",
    text: `import lib from "./lib.js"
console.log(lib)`,
  },
  {
    filename: "lib.js",
    text: `export default "lib";`,
  },
];

export interface SourceFile {
  filename: string;
  text: string;
}

export interface BundleResult {
  success: boolean;
  output: SourceFile[];
  formattedOutput: SourceFile[];
  duration: number;
  errors: string[];
  warnings: string[];
}

function getInitFiles() {
  const hash = window.location.hash.slice(1);
  if (hash) {
    const shareData = deserializeShareData(hash);
    if (shareData) {
      return shareData.inputFiles;
    }
  }
  return [...INITIAL_FILES];
}

// Bundle
export const isBundlingAtom = atom(false);
export const inputFilesAtom = atom<SourceFile[]>(getInitFiles());
export const bundleResultAtom = atom<BundleResult | null>(null);
export const enableFormatCode = atom(false);

// Version
export const availableVersionsAtom = atom(async () => {
  const res = await fetch(
    "https://registry.npmjs.org/@rspack/binding-wasm32-wasi",
  );
  const data = await res.json();
  return Object.keys(data.versions).sort((a, b) => {
    return b.localeCompare(a, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
});

function getInitRspackVersion() {
  const hash = window.location.hash.slice(1);
  if (hash) {
    const shareData = deserializeShareData(hash);
    if (shareData) {
      return shareData.rspackVersion;
    }
  }
}

const defaultRspackVersionAtom = atom(async (get) => {
  const versions = await get(availableVersionsAtom);
  return getInitRspackVersion() ?? versions[0] ?? "";
});
const overwrittenRspackVersionAtom = atom<string | null>(null);
export const rspackVersionAtom = atom(
  (get) => {
    const overwritten = get(overwrittenRspackVersionAtom);
    if (overwritten) return overwritten;
    return get(defaultRspackVersionAtom);
  },
  (_, set, newVersion: string) => {
    set(overwrittenRspackVersionAtom, newVersion);
  },
);
