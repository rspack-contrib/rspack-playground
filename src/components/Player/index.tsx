import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAtomValue } from "jotai";
import { bundleResultAtom, type SourceFile } from "@/store/bundler";
import { useEffect, useRef } from "react";

interface PlaygroundFrameProps {
  files: SourceFile[];
}

function PlaygroundFrame(props: PlaygroundFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {}, []);

  return (
    <iframe
      className="w-full h-full border-none"
      src="/preview"
      ref={iframeRef}
    />
  );
}

function Player() {
  const bundleResult = useAtomValue(bundleResultAtom);
  const entry = getEntry(bundleResult?.output || []);

  return (
    <div className="absolute right-6 bottom-6 opacity-0 hover:opacity-100 transition-opacity duration-300">
      <Dialog>
        <DialogTrigger disabled={!entry} asChild>
          <Button variant="secondary" size="icon" disabled={!entry}>
            <Play />
          </Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false} className="w-9/12 h-9/12">
          <DialogTitle className="hidden"></DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
          <PlaygroundFrame files={bundleResult?.output || []} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getEntry(sourceFiles: SourceFile[]) {
  const entry = sourceFiles.find((f) => f.filename.includes("index.html"));
  return entry;
}

export default Player;
