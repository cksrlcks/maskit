import { useCanvasActions } from "@/actions/canvas";
import { Button } from "@/components/ui";
import { useAlert } from "@/context/AlertContext";
import { Images } from "lucide-react";

export function Image() {
  const { handleRefresh } = useCanvasActions();
  const { onAlert } = useAlert();

  return (
    <Button
      variant="outline"
      size="icon"
      title="이미지 교체"
      onClick={() =>
        onAlert({
          title: "이미지교체",
          message: "작업내용이 사라집니다. 정말 교체할까요?",
          onAction: handleRefresh,
        })
      }
    >
      <Images className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">이미지 교체</span>
    </Button>
  );
}
