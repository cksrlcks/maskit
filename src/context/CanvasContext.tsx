import { createContext, PropsWithChildren, useContext } from "react";
import useCanvasApi from "@/hooks/useCanvasApi";

const CanvasContext = createContext<ReturnType<typeof useCanvasApi> | null>(null);

export function CanvasProvider({ children }: PropsWithChildren) {
  const canvasApi = useCanvasApi();

  const value = {
    ...canvasApi,
  };

  return <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>;
}

export function useCanvas() {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("Canvas Context는 Canvas Provider 내부에서 사용가능합니다.");
  }

  return context;
}
