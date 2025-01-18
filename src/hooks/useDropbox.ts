import { useState } from "react";
import { toast } from "./useToast";
import { MESSAGE, TOAST_DURATION } from "@/constants/common";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Dropbox: any;

export default function useDropbox() {
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
              title: MESSAGE.UPLOAD.DROPBOX.FAIL.TITLE,
              description: MESSAGE.UPLOAD.DROPBOX.FAIL.DESC,
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
