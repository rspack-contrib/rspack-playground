import { useAtom } from "jotai";
import CodeEditor from "@/components/Editor/CodeEditor";
import { bundle } from "@/lib/bundle";
import type { SourceFile } from "@/store/bundler";
import {
  bundleResultAtom,
  inputFilesAtom,
  isBundlingAtom,
} from "@/store/bundler";
import { activeInputFileAtom, activeOutputFileAtom } from "@/store/editor";

function Editor() {
  const [inputFiles, _setInputFiles] = useAtom(inputFilesAtom);
  const [activeInputFile, setActiveInputFile] = useAtom(activeInputFileAtom);
  const [activeOutputFile, setActiveOutputFile] = useAtom(activeOutputFileAtom);
  const [_isBundling, setIsBundling] = useAtom(isBundlingAtom);
  const [bundleResult, setBundleResult] = useAtom(bundleResultAtom);

  const setInputFiles = (files: SourceFile[]) => {
    _setInputFiles(files);
    handleBundle();
  };

  const handleBundle = async () => {
    setIsBundling(true);
    const result = await bundle(inputFiles);
    setBundleResult(result);

    if (result.success) {
      setBundleResult(result);
      if (
        result.output.length > 0 &&
        activeOutputFile >= result.output.length
      ) {
        setActiveOutputFile(0);
      }
    }

    setIsBundling(false);
  };

  const handleInputFileCreate = (filename: string) => {
    const newFile: SourceFile = {
      filename,
      text: "",
    };
    setInputFiles([...inputFiles, newFile]);
    setActiveInputFile(inputFiles.length);
  };

  const handleInputFileDelete = (index: number) => {
    if (inputFiles.length <= 1) return;

    const newFiles = inputFiles.filter((_, i) => i !== index);
    setInputFiles(newFiles);

    if (activeInputFile >= newFiles.length) {
      setActiveInputFile(newFiles.length - 1);
    } else if (activeInputFile > index) {
      setActiveInputFile(activeInputFile - 1);
    }
  };

  const handleInputFileRename = (index: number, newName: string) => {
    const newFiles = [...inputFiles];
    newFiles[index] = { ...newFiles[index], filename: newName };
    setInputFiles(newFiles);
  };

  const handleInputContentChange = (index: number, content: string) => {
    const newFiles = [...inputFiles];
    newFiles[index] = { ...newFiles[index], text: content };
    setInputFiles(newFiles);
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col border-r">
        <div className="flex items-center justify-between p-2 border-b bg-muted/30">
          <span className="text-sm font-medium">Input Files</span>
        </div>
        <div className="flex-1">
          <CodeEditor
            files={inputFiles}
            activeIndex={activeInputFile}
            onFileSelect={setActiveInputFile}
            onFileCreate={handleInputFileCreate}
            onFileDelete={handleInputFileDelete}
            onFileRename={handleInputFileRename}
            onContentChange={handleInputContentChange}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-2 border-b bg-muted/30">
          <span className="text-sm font-medium">Output Files</span>
          <span className="text-xs text-muted-foreground">
            {bundleResult?.output.length} file
            {bundleResult?.output.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex-1">
          {bundleResult && bundleResult?.output.length > 0 ? (
            <CodeEditor
              files={bundleResult.output}
              activeIndex={activeOutputFile}
              onFileSelect={setActiveOutputFile}
              readonly
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <div className="text-lg mb-2">No output yet</div>
                <div className="text-sm">
                  Modify your code to see the bundled result
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Editor;
