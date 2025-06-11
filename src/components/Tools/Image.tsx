import { useCanvasActions } from "@/hooks/useCanvasActions";
import { Button } from "@/components/ui";
import { useAlert } from "@/context/AlertContext";
import { Images } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Image() {
  const { t } = useTranslation();
  const { handleRefresh } = useCanvasActions();
  const { onAlert } = useAlert();

  return (
    <Button
      variant="outline"
      size="icon"
      title={t("tool.replace_image")}
      onClick={() =>
        onAlert({
          title: t("tool.replace_image"),
          message: t("tool.replace_image_ment"),
          onAction: handleRefresh,
        })
      }
    >
      <Images className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">{t("tool.replace_image")}</span>
    </Button>
  );
}
