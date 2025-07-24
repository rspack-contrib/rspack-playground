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
export const rspackVersionAtom = atom("1.0.0");
export const availableVersionsAtom = atom(["1.0.0", "0.9.0", "0.8.0"]);
