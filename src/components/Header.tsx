import { useAtom } from "jotai";
import { Clock } from "lucide-react";
import Github from "@/components/icon/Github";
import Logo from "@/components/icon/Rspack";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  availableVersionsAtom,
  bundleResultAtom,
  isBundlingAtom,
  rspackVersionAtom,
} from "@/store/bundler";

export default function Header() {
  const [rspackVersion, setRspackVersion] = useAtom(rspackVersionAtom);
  const [availableVersions] = useAtom(availableVersionsAtom);
  const [bundleResult] = useAtom(bundleResultAtom);
  const [isBundling] = useAtom(isBundlingAtom);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center space-x-3 max-h-full">
          <Logo className="w-10 h-10" />
          <h1 className="text-lg font-semibold">Rspack REPL</h1>
        </div>
        <div className="flex-1" />
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
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

          {/* Bundle Duration */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {isBundling
                ? "Bundling..."
                : bundleResult
                  ? `${bundleResult.duration}ms`
                  : "--ms"}
            </span>
          </div>
          <ModeToggle />
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/web-infra-dev/rspack"
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
