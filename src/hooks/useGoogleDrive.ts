import { useEffect, useState } from "react";
import useDrivePicker from "react-google-drive-picker";
import { toast } from "./useToast";
import { MESSAGE, TOAST_DURATION } from "@/constants/common";

export default function useGoogleDrive() {
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
          title: MESSAGE.UPLOAD.GOOGLE_DRIVE.FAIL.TITLE,
          description: MESSAGE.UPLOAD.GOOGLE_DRIVE.FAIL.DESC,
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [token, fileId]);

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
