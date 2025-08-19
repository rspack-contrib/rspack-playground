import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Clock, RotateCcw, Share2 } from "lucide-react";
import { toast } from "sonner";
import Github from "@/components/icon/Github";
import Logo from "@/components/icon/Rspack";
import { ModeToggle } from "@/components/ModeToggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useBundle from "@/hooks/use-bundle";
import { getShareUrl, type ShareData } from "@/lib/share";
import {
  availableVersionsAtom,
  bundleResultAtom,
  INITIAL_FILES,
  inputFilesAtom,
  isBundlingAtom,
  rspackVersionAtom,
} from "@/store/bundler";

export default function Header() {
  const [rspackVersion, setRspackVersion] = useAtom(rspackVersionAtom);
  const availableVersions = useAtomValue(availableVersionsAtom);
  const [bundleResult] = useAtom(bundleResultAtom);
  const [isBundling] = useAtom(isBundlingAtom);
  const [inputFiles] = useAtom(inputFilesAtom);
  const setInputFiles = useSetAtom(inputFilesAtom);
  const handleBundle = useBundle();

  const handleReset = () => {
    const files = [...INITIAL_FILES];
    setInputFiles(files);
    handleBundle(files);
    window.history.replaceState(null, "", window.location.pathname);
  };

  const handleShare = async () => {
    try {
      const shareData: ShareData = {
        rspackVersion,
        inputFiles,
      };

      const shareUrl = getShareUrl(shareData);
      await navigator.clipboard.writeText(shareUrl);
      window.history.replaceState(null, "", shareUrl);
      toast.success("Share link copied to clipboard!");
    } catch (error) {
      console.error("Failed to share:", error);
      toast.error("Failed to copy share link");
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center space-x-3 max-h-full">
          <Logo className="w-10 h-10" />
          <h1 className="text-lg font-semibold">Rspack Playground</h1>
        </div>
        <div className="flex-1" />
        <div className="flex items-center space-x-4">
          {/* Bundle Duration */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {isBundling
                ? "Bundling..."
                : bundleResult
                  ? `${bundleResult.duration.toFixed(0)}ms`
                  : "--ms"}
            </span>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={handleShare}
            title="Share current configuration"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
          <div className="flex items-center space-x-2 hidden">
            <span className="text-sm text-muted-foreground">Version:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  v{rspackVersion}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {availableVersions.map((version) => (
                  <DropdownMenuItem
                    key={version}
                    onClick={() => setRspackVersion(version)}
                    className={rspackVersion === version ? "bg-accent" : ""}
                  >
                    v{version}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <ModeToggle />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                title="Reset to initial files"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Files</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all files to their initial state. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset}>
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/rspack-contrib/rspack-playground"
              target="_blank"
              rel="noopener noreferrer"
              title="View on GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
