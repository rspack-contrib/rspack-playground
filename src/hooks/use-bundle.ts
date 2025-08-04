import { useAtom, useSetAtom } from "jotai";
import { useCallback } from "react";
import {
  bundleResultAtom,
  isBundlingAtom,
  type SourceFile,
} from "@/store/bundler";
import { activeOutputFileAtom } from "@/store/editor";

export default function useBundle() {
  const setIsBundling = useSetAtom(isBundlingAtom);
  const setBundleResult = useSetAtom(bundleResultAtom);
  const [activeOutputFile, setActiveOutputFile] = useAtom(activeOutputFileAtom);

  const handleBundle = useCallback(
    async (files: SourceFile[]) => {
      setIsBundling(true);
      const result = await (await import("@/lib/bundle")).bundle(files);
      setBundleResult(result);

      if (
        result.output.length > 0 &&
        activeOutputFile >= result.output.length
      ) {
        setActiveOutputFile(0);
      }

      setIsBundling(false);
    },
    [activeOutputFile, setActiveOutputFile, setIsBundling, setBundleResult],
  );

  return handleBundle;
}
