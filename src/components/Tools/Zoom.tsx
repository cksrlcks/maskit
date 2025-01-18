import { useCanvasActions } from "@/actions/canvas";
import { Button } from "@/components/ui";
import { ZoomIn, ZoomOut } from "lucide-react";

export function Zoom({
  type,
  amount,
  disabled,
}: {
  type: "zoom-in" | "zoom-out";
  amount: number;
  disabled: boolean;
}) {
  const { handleZoom } = useCanvasActions();
  const label = type === "zoom-in" ? "확대" : "축소";

  return (
    <Button
      variant="outline"
      size="icon"
      title={label}
      onClick={() => handleZoom(amount)}
      disabled={disabled}
    >
      {type === "zoom-in" ? (
        <ZoomIn className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <ZoomOut className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">{label}</span>
    </Button>
  );
}
