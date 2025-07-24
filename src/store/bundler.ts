import { atom } from "jotai";

export interface File {
  filename: string;
  text: string;
}

export interface BundleResult {
  success: boolean;
  output: File[];
  error?: string;
  duration: number;
}

// Bundle
export const isBundlingAtom = atom(false);
export const sourceFilesAtom = atom<File[]>([]);
export const bundleResultAtom = atom<BundleResult | null>(null);

// Version
export const rspackVersionAtom = atom("1.0.0");
export const availableVersionsAtom = atom(["1.0.0", "0.9.0", "0.8.0"]);
