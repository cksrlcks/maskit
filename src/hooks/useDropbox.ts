import { useState } from "react";
import { toast } from "./useToast";
import { TOAST_DURATION } from "@/constants/common";
import { useTranslation } from "react-i18next";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Dropbox: any;

export default function useDropbox() {
  const { t } = useTranslation();
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleOpenPicker() {
    if (Dropbox) {
      Dropbox.choose({
        linkType: "direct",
        extensions: [".jpg", ".jpeg", ".png", ".svg"],
        success: async function (files: { link: string }[]) {
          try {
            setIsLoading(true);
            const response = await fetch(files[0].link);
            const blob = await response.blob();
            setBlob(blob);
          } catch (error) {
            console.error(error);
            toast({
              duration: TOAST_DURATION,
              variant: "destructive",
              title: t("upload.dropbox.fail.title"),
              description: t("upload.dropbox.fail.desc"),
            });
          } finally {
            setIsLoading(false);
          }
        },
      });
    }
  }

  return {
    blob,
    isLoading,
    handleOpenPicker,
  };
}
