import { Edit2, Plus, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SourceFile } from "@/store/bundler";

interface FileTabsProps {
  files: SourceFile[];
  activeIndex: number;
  onFileSelect: (index: number) => void;
  onFileCreate: (filename: string) => void;
  onFileDelete: (index: number) => void;
  onFileRename: (index: number, newName: string) => void;
  readonly?: boolean;
}

export default function FileTabs({
  files,
  activeIndex,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  readonly = false,
}: FileTabsProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  const handleStartEdit = (index: number, currentName: string) => {
    if (readonly) return;
    setEditingIndex(index);
    setEditingName(currentName);
  };

  const handleFinishEdit = () => {
    if (editingIndex !== null && editingName.trim()) {
      onFileRename(editingIndex, editingName.trim());
    }
    setEditingIndex(null);
    setEditingName("");
  };

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      onFileCreate(newFileName.trim());
      setNewFileName("");
    }
    setShowCreateInput(false);
  };

  const handleDeleteFile = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (readonly || files.length <= 1) return;
    onFileDelete(index);
  };

  return (
    <div className="flex items-center border-b bg-muted/50">
      <div className="flex flex-1 overflow-x-auto scrollbar-thin">
        {files.map((file, index) => (
          <div
            key={file.filename}
            className={cn(
              "group flex items-center space-x-2 px-3 py-2 border-r cursor-pointer hover:bg-accent/50 transition-colors flex-shrink-0",
              activeIndex === index &&
                "bg-background border-b-2 border-b-primary",
            )}
            onClick={() => onFileSelect(index)}
          >
            {editingIndex === index ? (
              <input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={handleFinishEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFinishEdit();
                  if (e.key === "Escape") {
                    setEditingIndex(null);
                    setEditingName("");
                  }
                }}
                className="text-sm bg-transparent border-none outline-none flex-1"
                autoFocus
              />
            ) : (
              <>
                <span
                  className="text-sm truncate flex-1 min-w-0"
                  onDoubleClick={() => handleStartEdit(index, file.filename)}
                >
                  {file.filename}
                </span>
                {!readonly && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(index, file.filename);
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    {files.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
                        onClick={(e) => handleDeleteFile(e, index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {!readonly && (
        <div className="flex items-center px-2">
          {showCreateInput ? (
            <div className="flex items-center space-x-2">
              <input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onBlur={() => {
                  if (!newFileName.trim()) setShowCreateInput(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateFile();
                  if (e.key === "Escape") {
                    setNewFileName("");
                    setShowCreateInput(false);
                  }
                }}
                placeholder="filename.js"
                className="text-sm px-2 py-1 border rounded w-24 outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowCreateInput(true)}
              title="New file"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
