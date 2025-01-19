import { useCanvasActions } from "@/actions/canvas";
import { canvasAtom } from "@/atoms/canvas";
import { Button } from "@/components/ui";
import { useAtomValue } from "jotai";
import { EyeOff, Eye as EyeOn } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Eye() {
  const { t } = useTranslation();
  const { isMaskMode } = useAtomValue(canvasAtom);
  const { handleToggleHide } = useCanvasActions();

  return (
    <Button
      variant="outline"
      size="icon"
      title={isMaskMode ? t("tool.hide_mask") : t("tool.show_mask")}
      onClick={handleToggleHide}
    >
      {isMaskMode ? (
        <EyeOff className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <EyeOn className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">{isMaskMode ? t("tool.hide_mask") : t("tool.show_mask")}</span>
    </Button>
  );
}
