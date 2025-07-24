import Editor from "@/components/Editor";
import { ModeToggle } from "@/components/ModeToggle";
import { ThemeProvider } from "@/components/ThemeProvider";

const App = () => {
  return (
    <ThemeProvider defaultTheme="system">
      <div>
        <div>
          <div>Rspack</div>
          <ModeToggle />
        </div>
        <div>
          <Editor />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
