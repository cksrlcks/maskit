import { useState } from "react";
import { toast } from "./useToast";

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
              duration: 2000,
              variant: "destructive",
              title: "권한이 없어요",
              description: "드롭박스에서 데이터를 가져오는데 실패했어요",
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
