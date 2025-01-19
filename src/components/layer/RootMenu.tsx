import {
  Menu,
  Download,
  Copy,
  Share,
  Info,
  Mail,
  MessageCircle,
  Smartphone,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import {
  Button,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Accordion,
  AccordionTrigger,
  AccordionItem,
  AccordionContent,
} from "@/components/ui";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Feature } from "../Welcome";
import { useNavigate } from "react-router-dom";
import { useCanvasActions } from "@/actions/canvas";
import { useAtomValue } from "jotai";
import { imageAtom } from "@/atoms/image";
import { MESSAGE } from "@/constants/common";
import { useTranslation } from "react-i18next";

type FeatureItem = {
  title: string;
  desc: string;
};

export function RootMenu() {
  const { t } = useTranslation();
  const image = useAtomValue(imageAtom);
  const { handleImage } = useCanvasActions();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isFeatureOpen, setIsFeatureOpen] = useState(false);
  const navigate = useNavigate();

  useHotkeys("shift+?, ?, shfit+/", (e) => {
    e.preventDefault();
    setIsHelpOpen(true);
  });

  useHotkeys("shift+!, !", (e) => {
    e.preventDefault();
    setIsFeatureOpen(true);
  });

  function handlePrivacy() {
    if (image.element || image.url) {
      const confirm = window.confirm(MESSAGE.RESET_ALERT);
      if (!confirm) return;
    }
    navigate("/privacy", { replace: true });
  }

  const features = Object.values(
    t("dialog.question.list", { returnObjects: true }),
  ) as FeatureItem[];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <Menu className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">{t("menu.menu")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>{t("menu.menu")}</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleImage("download")} disabled={!image}>
            <Download />
            {t("menu.save_image")}
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleImage("copy")} disabled={!image}>
            <Copy />
            {t("menu.copy_image")}
            <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Share />
              {t("menu.share_image")}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleImage("share")} disabled={!image}>
                  <Smartphone />
                  {t("menu.share_image")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleImage("mail")} disabled={!image}>
                  <Mail />
                  {t("menu.send_email")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleImage("kakao")} disabled={!image}>
                  <MessageCircle /> {t("menu.kakao")}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsFeatureOpen(true)}>
            <Sparkles />
            {t("menu.feature")}
            <DropdownMenuShortcut>!</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsHelpOpen(true)}>
            <Info />
            {t("menu.question")}
            <DropdownMenuShortcut>?</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrivacy}>
            <ShieldCheck />
            {t("menu.privacy")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
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

      <Dialog open={isFeatureOpen} onOpenChange={setIsFeatureOpen}>
        <DialogContent
          className="max-w-[400px] overflow-hidden rounded-md border-none bg-transparent p-0 shadow-none"
          showCloseButton={false}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{t("dialog.feature.title")}</DialogTitle>
            <DialogDescription>{t("dialog.feature.desc")}</DialogDescription>
          </DialogHeader>
          <Feature onClose={() => setIsFeatureOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
