import Editor from '@/components/Editor';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ModeToggle } from '@/components/ModeToggle';

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
