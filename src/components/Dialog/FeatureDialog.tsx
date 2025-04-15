import { dialogAtom } from "@/atoms/dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui";
import { Feature } from "@/components/Welcome";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";

export function FeatureDialog() {
  const { t } = useTranslation();
  const [dialog, setDialog] = useAtom(dialogAtom);

  return (
    <Dialog open={dialog === "feature"} onOpenChange={() => setDialog(null)}>
      <DialogContent
        className="max-w-[400px] overflow-hidden rounded-md border-none bg-transparent p-0 shadow-none"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{t("dialog.feature.title")}</DialogTitle>
          <DialogDescription>{t("dialog.feature.desc")}</DialogDescription>
        </DialogHeader>
        <Feature onClose={() => setDialog(null)} />
      </DialogContent>
    </Dialog>
  );
}
