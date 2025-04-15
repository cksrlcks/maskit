import { useCanvasActions } from "@/hooks/useCanvasActions";
import { Button } from "@/components/ui";
import { ZoomIn, ZoomOut } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Zoom({
  type,
  amount,
  disabled,
}: {
  type: "zoom-in" | "zoom-out";
  amount: number;
  disabled: boolean;
}) {
  const { t } = useTranslation();
  const { handleZoom } = useCanvasActions();
  const label = type === "zoom-in" ? t("tool.zoom_in") : t("tool.zoom_out");

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
