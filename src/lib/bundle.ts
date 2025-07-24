import type { BundleResult, File } from "@/store/bundler";

export async function bundle(_files: File[]): Promise<BundleResult> {
  return {
    duration: 1145,
    output: [],
    success: true,
    error: "",
  };
}
