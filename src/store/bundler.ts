import { atom } from "jotai";

export interface File {
  filename: string;
  text: string;
}

export const sourceFiles = atom<File[]>([]);
