import MonacoEditor from "@monaco-editor/react";
import FileTabs from "@/components/Editor/FileTabs";
import { useTheme } from "@/components/ThemeProvider";
import type { SourceFile } from "@/store/bundler";

interface CodeEditorProps {
  files: SourceFile[];
  activeIndex: number;
  readonly?: boolean;
  onFileSelect: (index: number) => void;
  onFileCreate?: (filename: string) => void;
  onFileDelete?: (index: number) => void;
  onFileRename?: (index: number, newName: string) => void;
  onContentChange?: (index: number, content: string) => void;
}

export default function CodeEditor({
  files,
  activeIndex,
  readonly = false,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  onContentChange,
}: CodeEditorProps) {
  const { theme } = useTheme();

  const currentFile = files[activeIndex];

  const getLanguage = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "js":
      case "jsx":
        return "javascript";
      case "ts":
      case "tsx":
        return "typescript";
      case "css":
        return "css";
      case "html":
        return "html";
      case "json":
        return "json";
      case "md":
        return "markdown";
      default:
        return "javascript";
    }
  };

  const handleCreateFile = (filename: string) => {
    if (onFileCreate) {
      onFileCreate(filename);
    }
  };

  const handleDeleteFile = (index: number) => {
    if (onFileDelete) {
      onFileDelete(index);
    }
  };

  const handleRenameFile = (index: number, newName: string) => {
    if (onFileRename) {
      onFileRename(index, newName);
    }
  };

  const handleContentChange = (value: string | undefined) => {
    if (onContentChange && value !== undefined) {
      onContentChange(activeIndex, value);
    }
  };

  if (!currentFile) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No file selected
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <FileTabs
        files={files}
        activeIndex={activeIndex}
        onFileSelect={onFileSelect}
        onFileCreate={handleCreateFile}
        onFileDelete={handleDeleteFile}
        onFileRename={handleRenameFile}
        readonly={readonly}
      />

      <div className="flex-1 min-h-0">
        <MonacoEditor
          value={currentFile.text}
          language={getLanguage(currentFile.filename)}
          theme={theme === "dark" ? "vs-dark" : "vs"}
          onChange={handleContentChange}
          options={{
            readOnly: readonly,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
          }}
        />
      </div>
    </div>
  );
}
