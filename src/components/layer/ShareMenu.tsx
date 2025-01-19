import { Copy, Download, Mail, Share, Smartphone } from "lucide-react";
import { Button } from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useAtomValue } from "jotai";
import { imageAtom } from "@/atoms/image";
import { useCanvasActions } from "@/actions/canvas";
import { useTranslation } from "react-i18next";

export function ShareMenu() {
  const { t } = useTranslation();
  const image = useAtomValue(imageAtom);
  const { handleImage } = useCanvasActions();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Share className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t("menu.share")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleImage("copy")} disabled={!image.element}>
          <Copy />
          {t("menu.share_image")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleImage("download")} disabled={!image.element}>
          <Download />
          {t("menu.save_image")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleImage("share")} disabled={!image.element}>
          <Smartphone />
          {t("menu.share_image")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleImage("mail")} disabled={!image.element}>
          <Mail />
          {t("menu.send_email")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
