import { dialogAtom } from "@/atoms/dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";

type FeatureItem = {
  title: string;
  desc: string;
};

export function HelpDialog() {
  const { t } = useTranslation();
  const [dialog, setDialog] = useAtom(dialogAtom);

  const features = Object.values(
    t("dialog.question.list", { returnObjects: true }),
  ) as FeatureItem[];

  return (
    <Dialog open={dialog === "help"} onOpenChange={() => setDialog(null)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("dialog.question.title")}</DialogTitle>
          <DialogDescription>{t("dialog.question.desc")}</DialogDescription>
        </DialogHeader>
        <Accordion type="single" collapsible className="w-full">
          {features.map((item, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent>{item.desc}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}
