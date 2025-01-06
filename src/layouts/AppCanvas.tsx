import { Canvas, Upload } from "@/components/Canvas";
import { useCanvas } from "@/context/CanvasContext";

export function AppCanvas() {
  const { imageUrl } = useCanvas();

  return !imageUrl ? <Upload /> : <Canvas />;
}
