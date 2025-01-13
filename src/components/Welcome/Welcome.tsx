import { useState } from "react";
import { Button, DialogContent, Dialog } from "../ui";
import { Feature } from "./Feature";

export function Welcome() {
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
    date.setDate(date.getDate() + 7);
    localStorage.setItem("hideUtil", date.toISOString());
    setShowWelcome(false);
  }

  if (!showWelCome) return null;

  return (
    <Dialog open={showWelCome}>
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
          일주일동안 보지 않기
        </Button>
      </DialogContent>
    </Dialog>
  );
}
