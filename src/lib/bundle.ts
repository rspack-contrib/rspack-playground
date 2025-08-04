import { builtinMemFs, type RspackOptions, rspack } from "@rspack/browser";
import {
  type BundleResult,
  RSPACK_CONFIG,
  type SourceFile,
} from "@/store/bundler";

export async function bundle(files: SourceFile[]): Promise<BundleResult> {
  const startTime = performance.now();

  const fileJSON: Record<string, string> = {};
  for (const file of files) {
    fileJSON[file.filename] = file.text;
  }
  builtinMemFs.volume.fromJSON(fileJSON);

  const configCode = fileJSON[RSPACK_CONFIG];
  const dataUrl = `data:text/javascript;base64,${btoa(configCode)}`;
  // biome-ignore lint/security/noGlobalEval: use `eval("import")` rather than `import` to suppress the warning in @rspack/browser
  const configModulePromise = eval(`import("${dataUrl}")`);
  const options: RspackOptions = (await configModulePromise).default;

  return new Promise((resolve) => {
    rspack(options, (_err, _stats) => {
      const output: SourceFile[] = [];
      const fileJSON: Record<string, string> = builtinMemFs.volume.toJSON();
      for (const [filename, text] of Object.entries(fileJSON)) {
        if (filename.startsWith("/dist")) {
          output.push({ filename, text });
        }
      }

      const endTime = performance.now();
      resolve({
        duration: endTime - startTime,
        output,
        success: true,
        error: "",
      });
    });
  });
}
