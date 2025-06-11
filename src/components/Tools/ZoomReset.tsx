import { useCanvasActions } from "@/hooks/useCanvasActions";
import { Button } from "@/components/ui";
import { Fullscreen } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ZoomReset() {
  const { t } = useTranslation();
  const { handleResize } = useCanvasActions();

  return (
    <Button
      variant="outline"
      size="icon"
      title={t("tool.zoom_fit")}
      onClick={handleResize}
      disabled={false}
    >
      <Fullscreen className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">{t("tool.zoom_fit")}</span>
    </Button>
  );
}
