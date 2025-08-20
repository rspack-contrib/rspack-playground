import type { SourceFile } from "../bundler";
import PresetBasicLibrary from "./basic-library";
import PresetEsmSh from "./esm-sh";

export interface SourcePreset {
  name: string;
  files: SourceFile[];
}

export const presets: SourcePreset[] = [PresetBasicLibrary, PresetEsmSh];

export { PresetBasicLibrary, PresetEsmSh };
