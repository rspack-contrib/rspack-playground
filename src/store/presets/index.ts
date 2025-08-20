import type { SourceFile } from "../bundler";
import PresetBasicLibrary from "./basic-library";
import PresetEsmSh from "./esm-sh";
import PresetReact from "./react";

export interface SourcePreset {
  name: string;
  files: SourceFile[];
}

export const presets: SourcePreset[] = [
  PresetBasicLibrary,
  PresetEsmSh,
  PresetReact,
];

export { PresetBasicLibrary, PresetEsmSh, PresetReact };
