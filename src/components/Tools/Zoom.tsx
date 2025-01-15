import { Button } from "@/components/ui";
import { useCanvas } from "@/context/CanvasContext";
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
  const { handleZoom } = useCanvas();
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
