import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui";
import { useTranslation } from "react-i18next";
import { SHORTCUTS } from "@/constants/common";
import { useAtom, useAtomValue } from "jotai";
import { osAtom } from "@/atoms/os";
import { useHotkeys } from "react-hotkeys-hook";
import { dialogAtom } from "@/atoms/dialog";

export function GuideDialog() {
  const { t } = useTranslation();
  const [dialog, setDialog] = useAtom(dialogAtom);
  const os = useAtomValue(osAtom);

  useHotkeys("/", (e) => {
    e.preventDefault();
    setDialog("guide");
  });

  return (
    <Dialog open={dialog === "guide"} onOpenChange={() => setDialog(null)}>
      <DialogContent className="focus-visible:outline-none sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("dialog.guide.title")}</DialogTitle>
          <DialogDescription>{t("dialog.guide.desc")}</DialogDescription>
        </DialogHeader>
        <ul className="my-2 grid gap-4">
          <li className="flex items-center justify-between text-xs">
            <div className="text-muted-foreground">{t("dialog.guide.list.paste")}</div>
            <div className="text-muted-foreground">{SHORTCUTS.PASTE[os]}</div>
          </li>
          <li className="flex items-center justify-between text-xs">
            <div className="text-muted-foreground">{t("dialog.guide.list.copy")}</div>
            <div className="text-muted-foreground">{SHORTCUTS.COPY[os]}</div>
          </li>
          <li className="flex items-center justify-between text-xs">
            <div className="text-muted-foreground">{t("dialog.guide.list.save")}</div>
            <div className="text-muted-foreground">{SHORTCUTS.SAVE[os]}</div>
          </li>
          <li className="flex items-center justify-between text-xs">
            <div className="text-muted-foreground">{t("dialog.guide.list.delete")}</div>
            <div className="text-muted-foreground">{SHORTCUTS.DELETE[os]}</div>
          </li>
          <li className="flex items-center justify-between text-xs">
            <div className="text-muted-foreground">{t("dialog.guide.list.feat")}</div>
            <div className="text-muted-foreground">{SHORTCUTS.FEAT[os]}</div>
          </li>
          <li className="flex items-center justify-between text-xs">
            <div className="text-muted-foreground">{t("dialog.guide.list.guide")}</div>
            <div className="text-muted-foreground">{SHORTCUTS.GUIDE[os]}</div>
          </li>
          <li className="flex items-center justify-between text-xs">
            <div className="text-muted-foreground">{t("dialog.guide.list.qna")}</div>
            <div className="text-muted-foreground">{SHORTCUTS.QNA[os]}</div>
          </li>
        </ul>
      </DialogContent>
    </Dialog>
  );
}
