import type { BundleResult, SourceFile } from "@/store/bundler";

export async function bundle(_files: SourceFile[]): Promise<BundleResult> {
  // Simulate a 1 second delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    duration: 1145,
    output: [
      {
        filename: "index.js",
        text: "console.log('Hello, world!');",
      },
    ],
    success: true,
    error: "",
  };
}
