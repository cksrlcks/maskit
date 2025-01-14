import { AnimatePresence, motion } from "motion/react";
import { useCanvas } from "@/context/CanvasContext";
import { Button } from "@/components/ui";
import { Trash2 } from "lucide-react";

export function Delete() {
  const { selectedId, handleSelectDelete } = useCanvas();

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
            title="선택삭제"
            data-prevent-focusout
            onClick={handleSelectDelete}
          >
            <Trash2 className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">선택삭제</span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
