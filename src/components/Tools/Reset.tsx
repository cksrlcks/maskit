import { useCanvasActions } from "@/actions/canvas";
import { Button } from "@/components/ui";
import { useAlert } from "@/context/AlertContext";
import { Eraser } from "lucide-react";

export function Reset() {
  const { handleReset } = useCanvasActions();
  const { onAlert } = useAlert();

  return (
    <Button
      variant="outline"
      size="icon"
      title="전부 지우기"
      onClick={() =>
        onAlert({
          title: "작업초기화",
          message: "작업내용을 모두 지웁니다.",
          onAction: handleReset,
        })
      }
    >
      <Eraser className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">전부 지우기</span>
    </Button>
  );
}
