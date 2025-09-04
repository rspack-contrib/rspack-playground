import { Toaster } from "sonner";
import Editor from "@/components/Editor";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import Player from "./components/Player";

const App = () => {
  return (
    <ThemeProvider defaultTheme="system">
      <div className="relative h-screen flex flex-col">
        <Header />
        <main className="flex-1 overflow-hidden">
          <Editor />
        </main>
        <Player />
      </div>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
