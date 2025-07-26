import { atom } from "jotai";

export const RSPACK_CONFIG = "rspack.config.mjs";
export const INITIAL_FILES: SourceFile[] = [
  {
    filename: RSPACK_CONFIG,
    text: `export default {
  mode: "development",
	entry: {
		main: "./index.js"
	}
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
  error?: string;
  duration: number;
}

// Bundle
export const isBundlingAtom = atom(false);
export const inputFilesAtom = atom<SourceFile[]>([...INITIAL_FILES]);
export const bundleResultAtom = atom<BundleResult | null>(null);

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

const defaultRspackVersionAtom = atom(async (get) => {
  const versions = await get(availableVersionsAtom);
  return versions[0] ?? "";
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
