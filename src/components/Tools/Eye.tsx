import { Button } from "@/components/ui";
import { useCanvas } from "@/context/CanvasContext";
import { EyeOff, Eye as EyeOn } from "lucide-react";

export function Eye() {
  const { isMaskMode, handleToggleHide } = useCanvas();

  return (
    <Button
      variant="outline"
      size="icon"
      title={isMaskMode ? "보이기" : "가리기"}
      onClick={handleToggleHide}
    >
      {isMaskMode ? (
        <EyeOff className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <EyeOn className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">{isMaskMode ? "보이기" : "가리기"}</span>
    </Button>
  );
}
