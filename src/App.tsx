import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { Toaster } from "sonner";
import Editor from "@/components/Editor";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { deserializeShareData } from "@/lib/share";
import { inputFilesAtom, rspackVersionAtom } from "@/store/bundler";

const App = () => {
  const setInputFiles = useSetAtom(inputFilesAtom);
  const setRspackVersion = useSetAtom(rspackVersionAtom);

  useEffect(() => {
    // Initialize from URL hash if present
    const hash = window.location.hash.slice(1); // Remove the # symbol
    if (hash) {
      const shareData = deserializeShareData(hash);
      if (shareData) {
        setInputFiles(shareData.inputFiles);
        setRspackVersion(shareData.rspackVersion);
      }
    }
  }, [setInputFiles, setRspackVersion]);

  return (
    <ThemeProvider defaultTheme="system">
      <div className="h-screen flex flex-col">
        <Header />
        <main className="flex-1 overflow-hidden">
          <Editor />
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
