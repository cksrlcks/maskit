import { ThemeProvider } from "./context/ThemeContext";
import { RootLayout } from "./components/layout";
import { Canvas } from "@/components/Canvas";
import { CanvasProvider } from "./context/CanvasContext";
import { Toaster } from "./components/ui";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <CanvasProvider>
        <RootLayout>
          <Canvas />
          <Toaster />
        </RootLayout>
      </CanvasProvider>
    </ThemeProvider>
  );
}
