import { useAtom, useSetAtom } from "jotai";
import { useCallback } from "react";
import {
  bindingLoadedAtom,
  bindingLoadingAtom,
  bundleResultAtom,
  isBundlingAtom,
  type SourceFile,
} from "@/store/bundler";
import { activeOutputFileAtom } from "@/store/editor";

export default function useBundle() {
  const [bindingLoaded, setBindingLoaded] = useAtom(bindingLoadedAtom);
  const setBindingLoading = useSetAtom(bindingLoadingAtom);

  const setIsBundling = useSetAtom(isBundlingAtom);
  const setBundleResult = useSetAtom(bundleResultAtom);
  const [activeOutputFile, setActiveOutputFile] = useAtom(activeOutputFileAtom);

  const handleBundle = useCallback(
    async (files: SourceFile[]) => {
      setIsBundling(true);
      if (!bindingLoaded) {
        setBindingLoading(true);
      }
      const bundler = await import("@/lib/bundle");
      setBindingLoading(false);
      setBindingLoaded(true);

      const result = await bundler.bundle(files);
      setBundleResult(result);

      if (
        result.output.length > 0 &&
        activeOutputFile >= result.output.length
      ) {
        setActiveOutputFile(0);
      }

      setIsBundling(false);
    },
    [
      activeOutputFile,
      bindingLoaded,
      setActiveOutputFile,
      setIsBundling,
      setBundleResult,
      setBindingLoaded,
      setBindingLoading,
    ],
  );

  return handleBundle;
}
