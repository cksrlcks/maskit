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
  Earth,
  Check,
  Keyboard,
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
} from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { useCanvasActions } from "@/hooks/useCanvasActions";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { imageAtom } from "@/atoms/image";
import { useTranslation } from "react-i18next";
import { langAtom } from "@/atoms/lang";
import { globalStore } from "@/store/globalStore";
import { osAtom } from "@/atoms/os";
import { SHORTCUTS } from "@/constants/common";
import { dialogAtom } from "@/atoms/dialog";

export function RootMenu() {
  const { t } = useTranslation();
  const image = useAtomValue(imageAtom);
  const [lang, setLang] = useAtom(langAtom, { store: globalStore });
  const os = useAtomValue(osAtom);
  const setDialog = useSetAtom(dialogAtom);
  const { handleImage } = useCanvasActions();
  const navigate = useNavigate();

  function handlePrivacy() {
    if (image.element || image.url) {
      const confirm = window.confirm(t("reset_alert"));
      if (!confirm) return;
    }
    navigate("/privacy", { replace: true });
  }

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
            <DropdownMenuShortcut>{SHORTCUTS.SAVE[os]}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleImage("copy")} disabled={!image}>
            <Copy />
            {t("menu.copy_image")}
            <DropdownMenuShortcut>{SHORTCUTS.COPY[os]}</DropdownMenuShortcut>
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
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Earth />
              {t("menu.lang")}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setLang("ko")}>
                  {t("menu.lang_ko")}
                  {lang === "ko" && <Check className="ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang("en")}>
                  {t("menu.lang_en")}
                  {lang === "en" && <Check className="ml-auto" />}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDialog("feature")}>
            <Sparkles />
            {t("menu.feature")}
            <DropdownMenuShortcut>{SHORTCUTS.FEAT[os]}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDialog("help")}>
            <Info />
            {t("menu.question")}
            <DropdownMenuShortcut>{SHORTCUTS.QNA[os]}</DropdownMenuShortcut>
          </DropdownMenuItem>
          {os !== "MOBILE" && (
            <DropdownMenuItem onClick={() => setDialog("guide")}>
              <Keyboard />
              {t("menu.guide")}
              <DropdownMenuShortcut>{SHORTCUTS.GUIDE[os]}</DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handlePrivacy}>
            <ShieldCheck />
            {t("menu.privacy")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
