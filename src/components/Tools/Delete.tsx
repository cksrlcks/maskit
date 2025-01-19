import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui";
import { Trash2 } from "lucide-react";
import { useAtomValue } from "jotai";
import { canvasAtom } from "@/atoms/canvas";
import { useCanvasActions } from "@/actions/canvas";
import { useTranslation } from "react-i18next";

export function Delete() {
  const { t } = useTranslation();
  const { selectedId } = useAtomValue(canvasAtom);
  const { handleSelectDelete } = useCanvasActions();

  return (
    <AnimatePresence mode="popLayout">
      {selectedId && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          exit={{ opacity: 0, scale: 0, transition: { duration: 0.1 } }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Button
            variant="outline"
            size="icon"
            title={t("tool.delete_selection")}
            data-prevent-focusout
            onClick={handleSelectDelete}
          >
            <Trash2 className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">{t("tool.delete_selection")}</span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
