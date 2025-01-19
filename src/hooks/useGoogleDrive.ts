import { useEffect, useState } from "react";
import useDrivePicker from "react-google-drive-picker";
import { toast } from "./useToast";
import { TOAST_DURATION } from "@/constants/common";
import { useTranslation } from "react-i18next";

export default function useGoogleDrive() {
  const { t } = useTranslation();
  const [fileId, setFileId] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openPicker, authResult] = useDrivePicker();

  const token = authResult?.access_token;

  useEffect(() => {
    if (!fileId || !token) return;

    (async function getFileDataWithToken() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const blob = await response.blob();
        setBlob(blob);
      } catch (error) {
        console.error(error);
        toast({
          duration: TOAST_DURATION,
          variant: "destructive",
          title: t("upload.google_drive.fail.title"),
          description: t("upload.google_drive.fail.desc"),
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [token, fileId, t]);

  function handleOpenPicker() {
    openPicker({
      clientId: import.meta.env.VITE_GOOGLE_CLOUD_CLIENT_ID,
      developerKey: import.meta.env.VITE_GOOGLE_CLOUD_API_KEY,
      viewId: "DOCS",
      viewMimeTypes: "image/jpeg,image/png,image/gif",
      token: token,
      supportDrives: true,
      multiselect: false,
      callbackFunction: async (data) => {
        if (data.action === "picked") {
          const fileId = data.docs[0].id;
          setFileId(fileId);
        }
      },
    });
  }

  return { blob, isLoading, handleOpenPicker };
}
