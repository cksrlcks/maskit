import { useCanvasActions } from "@/actions/canvas";
import { Button } from "@/components/ui";
import { useAlert } from "@/context/AlertContext";
import { Eraser } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Reset() {
  const { t } = useTranslation();
  const { handleReset } = useCanvasActions();
  const { onAlert } = useAlert();

  return (
    <Button
      variant="outline"
      size="icon"
      title={t("tool.reset")}
      onClick={() =>
        onAlert({
          title: t("tool.reset"),
          message: t("tool.reset_ment"),
          onAction: handleReset,
        })
      }
    >
      <Eraser className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">{t("tool.reset")}</span>
    </Button>
  );
}
