import type { BundleResult, SourceFile } from "@/store/bundler";

export async function bundle(_files: SourceFile[]): Promise<BundleResult> {
  return {
    duration: 1145,
    output: [],
    success: true,
    error: "",
  };
}
