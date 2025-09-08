import { useAtomValue } from "jotai";
import { Play } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { bundleResultAtom, type SourceFile } from "@/store/bundler";

interface PreviewFrameProps {
  files: SourceFile[];
}

function PreviewFrame(props: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const files = props.files;
  const entry = getEntry(files);

  useEffect(() => {
    async function disposeServiceWorker() {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map((registration) => registration.unregister()),
      );
    }

    async function registerServiceWorker() {
      await disposeServiceWorker();

      const registration = await navigator.serviceWorker.register(
        "/preview/service-worker.js",
        { scope: "/preview/" },
      );

      function init(sw: ServiceWorker) {
        sw.postMessage({
          type: "init",
          files,
          scope: "/preview/",
        });
      }

      function waitToInit(sw: ServiceWorker) {
        sw.addEventListener("statechange", () => {
          if (sw.state === "activated") {
            init(sw);
          }
        });
      }

      if (registration.active) {
        init(registration.active);
      } else if (registration.installing) {
        waitToInit(registration.installing);
      }

      registration.addEventListener("updatefound", () => {
        const sw = registration.installing;
        if (sw) {
          waitToInit(sw);
        }
      });
    }

    const iframe = iframeRef.current;
    if (iframe?.contentWindow && entry?.filename) {
      const iframeWindow = iframe.contentWindow;
      registerServiceWorker().then(() => {
        const name = entry.filename.startsWith("/")
          ? entry.filename.slice(1)
          : entry.filename;
        iframeWindow.location = `/preview/${name}`;
      });
    }

    return () => {
      disposeServiceWorker();
    };
  }, [files, entry]);

  return (
    <iframe
      className="w-full h-full border-none"
      src="/preview"
      ref={iframeRef}
    />
  );
}

function Preview() {
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
        <DialogContent
          showCloseButton={false}
          className="max-w-full! w-9/12! h-8/12!"
        >
          <DialogTitle className="hidden"></DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
          <PreviewFrame files={bundleResult?.output || []} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getEntry(sourceFiles: SourceFile[]) {
  const entry = sourceFiles.find((f) => f.filename.includes("index.html"));
  return entry;
}

export default Preview;
