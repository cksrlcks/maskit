import { useState } from "react";
import { Button, DialogContent, Dialog, DialogHeader } from "../ui";
import { Feature } from "./Feature";
import { WELCOME_DONT_SHOW_PERIOD } from "@/constants/common";
import { useTranslation } from "react-i18next";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

export function Welcome() {
  const { t } = useTranslation();
  const [showWelCome, setShowWelcome] = useState(() => {
    const date = localStorage.getItem("hideUtil");

    if (date) {
      const now = new Date();
      const expirationDate = new Date(date);
      return now > expirationDate;
    }

    return true;
  });

  function handleDontShowForWeek() {
    const date = new Date();
    date.setDate(date.getDate() + WELCOME_DONT_SHOW_PERIOD);
    localStorage.setItem("hideUtil", date.toISOString());
    setShowWelcome(false);
  }

  if (!showWelCome) return null;

  return (
    <Dialog open={showWelCome}>
      <DialogHeader className="sr-only">
        <DialogTitle>{t("dialog.feature.title")}</DialogTitle>
        <DialogDescription>{t("dialog.feature.desc")}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className="max-w-[400px] gap-0 overflow-hidden rounded-md border-none bg-transparent p-0 shadow-none"
        showCloseButton={false}
      >
        <Feature onClose={() => setShowWelcome(false)} />
        <Button
          variant="link"
          className="-mt-2 px-0 font-normal text-muted-foreground"
          onClick={handleDontShowForWeek}
        >
          {t("welcome.dont_show")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
