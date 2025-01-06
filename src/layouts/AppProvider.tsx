import { AlertProvider } from "@/context/AlertContext";
import { CanvasProvider } from "@/context/CanvasContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { PropsWithChildren } from "react";

export function AppProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <AlertProvider>
        <CanvasProvider>{children}</CanvasProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}
