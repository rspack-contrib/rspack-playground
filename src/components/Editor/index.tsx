import { useAtom, useAtomValue } from "jotai";
import { debounce } from "lodash-es";
import { useEffect, useMemo } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CodeEditor from "@/components/Editor/CodeEditor";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useBundle from "@/hooks/use-bundle";
import type { BundleResult, SourceFile } from "@/store/bundler";
import {
  bundleResultAtom,
  enableFormatCode,
  inputFilesAtom,
  isBundlingAtom,
} from "@/store/bundler";
import { activeInputFileAtom, activeOutputFileAtom } from "@/store/editor";

interface InputPanelProps {
  inputFiles: SourceFile[];
  activeInputFile: number;
  setActiveInputFile: (index: number) => void;
  handleInputFileCreate: (filename: string) => void;
  handleInputFileDelete: (index: number) => void;
  handleInputFileRename: (index: number, newName: string) => void;
  handleInputContentChange: (index: number, content: string) => void;
}

function InputPanel({
  inputFiles,
  activeInputFile,
  setActiveInputFile,
  handleInputFileCreate,
  handleInputFileDelete,
  handleInputFileRename,
  handleInputContentChange,
}: InputPanelProps) {
  return (
    <Panel id="input" defaultSize={50} minSize={20} className="min-h-0">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-2 border-b bg-muted/30">
          <span className="text-sm font-medium">Input Files</span>
        </div>
        <div className="flex-1 min-h-0">
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
    </Panel>
  );
}

interface OutputPanelProps {
  bundleResult: BundleResult | null;
  activeOutputFile: number;
  isBundling: boolean;
  setActiveOutputFile: (index: number) => void;
}

function OutputPanel({
  bundleResult,
  activeOutputFile,
  setActiveOutputFile,
}: OutputPanelProps) {
  const [formatCode, setFormatCode] = useAtom(enableFormatCode);
  return (
    <Panel id="output" defaultSize={50} minSize={20} className="min-h-0">
      <div className="flex flex-col h-full relative">
        <div className="flex items-center justify-between p-2 border-b bg-muted/30">
          <span className="text-sm font-medium">Output Files</span>
          <span className="flex gap-2 text-xs text-accent-foreground">
            <Checkbox
              id="format-output"
              checked={formatCode}
              onCheckedChange={(state) => setFormatCode(Boolean(state))}
            />
            <Label htmlFor="format-output">Format Output</Label>
          </span>
        </div>
        <div className="flex-1 min-h-0">
          {bundleResult && bundleResult?.output.length > 0 ? (
            <PanelGroup
              id="output-group"
              direction="vertical"
              className="h-full"
            >
              <Panel id="output-editor" order={0}>
                <CodeEditor
                  files={
                    formatCode
                      ? bundleResult.formattedOutput
                      : bundleResult.output
                  }
                  activeIndex={activeOutputFile}
                  onFileSelect={setActiveOutputFile}
                  readonly
                />
              </Panel>
              {(bundleResult.errors.length > 0 ||
                bundleResult.warnings.length > 0) && (
                <>
                  <PanelResizeHandle className="h-1 bg-border hover:bg-border/80" />
                  <Panel
                    id="output-errors"
                    order={1}
                    minSize={0}
                    maxSize={33.33}
                  >
                    <pre className="p-2 h-full overflow-y-auto text-wrap">
                      {bundleResult.errors.map((err) => (
                        <div key={err} className="text-red-500">
                          {err}
                        </div>
                      ))}
                      {bundleResult.warnings.map((warning) => (
                        <div key={warning} className="text-orange-300">
                          {warning}
                        </div>
                      ))}
                    </pre>
                  </Panel>
                </>
              )}
            </PanelGroup>
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
    </Panel>
  );
}

function Editor() {
  const [inputFiles, _setInputFiles] = useAtom(inputFilesAtom);
  const [activeInputFile, setActiveInputFile] = useAtom(activeInputFileAtom);
  const [activeOutputFile, setActiveOutputFile] = useAtom(activeOutputFileAtom);
  const isBundling = useAtomValue(isBundlingAtom);
  const bundleResult = useAtomValue(bundleResultAtom);
  const handleBundle = useBundle();

  const debouncedHandleBundle = useMemo(
    () => debounce(handleBundle, 300),
    [handleBundle],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: initialize bundle on mount
  useEffect(() => {
    handleBundle(inputFiles);
  }, []);

  const setInputFiles = (files: SourceFile[]) => {
    _setInputFiles(files);
    debouncedHandleBundle(files);
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

  const ResizeHandle = ({ isVertical }: { isVertical: boolean }) => (
    <PanelResizeHandle
      className={`${
        isVertical
          ? "h-1 bg-border hover:bg-border/80"
          : "w-1 bg-border hover:bg-border/80"
      } transition-colors relative group`}
    >
      <div
        className={`absolute bg-border group-hover:bg-border/80 transition-colors ${
          isVertical ? "inset-x-0 top-1/2 h-0.5" : "inset-y-0 left-1/2 w-0.5"
        }`}
      />
      <div
        className={`absolute bg-border group-hover:bg-border/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
          isVertical
            ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1"
            : "inset-y-0 left-1/2 -translate-x-1/2 w-1 h-8"
        }`}
      />
    </PanelResizeHandle>
  );

  return (
    <div className="flex h-full">
      {/* Mobile layout (vertical) */}
      <div className="flex flex-col h-full w-full md:hidden">
        <PanelGroup id="editors-mobile" direction="vertical" className="h-full">
          <InputPanel
            inputFiles={inputFiles}
            activeInputFile={activeInputFile}
            setActiveInputFile={setActiveInputFile}
            handleInputFileCreate={handleInputFileCreate}
            handleInputFileDelete={handleInputFileDelete}
            handleInputFileRename={handleInputFileRename}
            handleInputContentChange={handleInputContentChange}
          />
          <ResizeHandle isVertical={true} />
          <OutputPanel
            bundleResult={bundleResult}
            activeOutputFile={activeOutputFile}
            setActiveOutputFile={setActiveOutputFile}
            isBundling={isBundling}
          />
        </PanelGroup>
      </div>

      {/* Desktop layout (horizontal) */}
      <div className="hidden md:flex h-full w-full">
        <PanelGroup
          id="editors-desktop"
          direction="horizontal"
          className="h-full"
        >
          <InputPanel
            inputFiles={inputFiles}
            activeInputFile={activeInputFile}
            setActiveInputFile={setActiveInputFile}
            handleInputFileCreate={handleInputFileCreate}
            handleInputFileDelete={handleInputFileDelete}
            handleInputFileRename={handleInputFileRename}
            handleInputContentChange={handleInputContentChange}
          />
          <ResizeHandle isVertical={false} />
          <OutputPanel
            bundleResult={bundleResult}
            activeOutputFile={activeOutputFile}
            setActiveOutputFile={setActiveOutputFile}
            isBundling={isBundling}
          />
        </PanelGroup>
      </div>
    </div>
  );
}

export default Editor;
