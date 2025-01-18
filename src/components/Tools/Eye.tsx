import { useCanvasActions } from "@/actions/canvas";
import { canvasAtom } from "@/atoms/canvas";
import { Button } from "@/components/ui";
import { useAtomValue } from "jotai";
import { EyeOff, Eye as EyeOn } from "lucide-react";

export function Eye() {
  const { isMaskMode } = useAtomValue(canvasAtom);
  const { handleToggleHide } = useCanvasActions();

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
