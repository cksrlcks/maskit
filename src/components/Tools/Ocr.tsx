import { Button } from "@/components/ui";
import { Loader2, WandSparkles } from "lucide-react";
import { useAtomValue } from "jotai";
import { ocrAtom } from "@/atoms/canvas";
import { useCanvasActions } from "@/hooks/useCanvasActions";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export function Ocr() {
  const { t } = useTranslation();
  const { isProcessing, data } = useAtomValue(ocrAtom);
  const { handleOCRMode } = useCanvasActions();

  return (
    <Button
      variant="outline"
      className="relative"
      size="icon"
      title={t("tool.ocr_draw")}
      onClick={handleOCRMode}
      disabled={isProcessing}
    >
      <>
        {isProcessing && <Loader2 className="absolute animate-spin" />}
        <WandSparkles className={clsx("h-[1.2rem] w-[1.2rem]", isProcessing && "opacity-20")} />
        <span className="sr-only">{t("tool.ocr_draw")}</span>
        {!isProcessing && data && (
          <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
          </span>
        )}
      </>
    </Button>
  );
}
