import type { SourceFile } from "../bundler";
import PresetBasicLibrary from "./basic-library";
import PresetEsmSh from "./esm-sh";
import PresetModuleFederationApp from "./module-federation-app";
import PresetReact from "./react";

export interface SourcePreset {
  name: string;
  files: SourceFile[];
}

export const presets: SourcePreset[] = [
  PresetBasicLibrary,
  PresetEsmSh,
  PresetReact,
  PresetModuleFederationApp,
];

export {
  PresetBasicLibrary,
  PresetEsmSh,
  PresetReact,
  PresetModuleFederationApp,
};
