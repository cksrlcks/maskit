import { useCanvasActions } from "@/actions/canvas";
import { Button } from "@/components/ui";
import { Fullscreen } from "lucide-react";

export function ZoomReset() {
  const { handleResize } = useCanvasActions();

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
