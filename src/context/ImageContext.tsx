import { createContext, PropsWithChildren, useContext } from "react";

const ImageContext = createContext(null);

export default function ImageProvider({ children }: PropsWithChildren) {
  const value = {};
  return <ImageContext.Provider value={value}>{children}</ImageContext.Provider>;
}

export function useImage() {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("Image context는 Image context provider 내부에서 사용 가능합니다.");
  }

  return context;
}
