import { Button } from "@/components/ui";
import { useCanvas } from "@/context/CanvasContext";
import { Fullscreen } from "lucide-react";

export function ZoomReset() {
  const { handleResize } = useCanvas();

  return (
    <Button
      variant="outline"
      size="icon"
      title="화면에맞추기"
      onClick={handleResize}
      disabled={false}
    >
      <Fullscreen className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">화면에 맞추기</span>
    </Button>
  );
}
