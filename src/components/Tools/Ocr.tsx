import { useCanvas } from "@/context/CanvasContext";
import { Button } from "@/components/ui";
import { Loader2, WandSparkles } from "lucide-react";

export function Ocr() {
  const { isOCRLoading, handleOCRMode } = useCanvas();

  return (
    <Button
      variant="outline"
      size="icon"
      title="자동 그리기"
      onClick={handleOCRMode}
      disabled={isOCRLoading}
    >
      {isOCRLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <WandSparkles className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">자동 그리기</span>

          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
          </span>
        </>
      )}
    </Button>
  );
}
