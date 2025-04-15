import { useAtom } from "jotai";
import { imageAtom } from "@/atoms/image";
import { getClipboardImage, getFileNameAndExt } from "@/lib/utils";
import { DEFAULT_IMAGE_NAME, TOAST_DURATION } from "@/constants/common";
import { toast } from "./useToast";
import { useTranslation } from "react-i18next";

export const useImageActions = () => {
  const { t } = useTranslation();
  const [image, setImage] = useAtom(imageAtom);

  const handleUpload = (files: File[]) => {
    const file = files?.[0];
    if (file) {
      //todo : refactoring (enum 사용해보기)
      const [fileName, fileExt] = getFileNameAndExt(file.name);
      if (
        fileExt === "jpg" ||
        fileExt === "jpeg" ||
        fileExt === "png" ||
        fileExt === "svg" ||
        fileExt === "webp"
      ) {
        const url = URL.createObjectURL(file);
        setImage((prev) => ({ ...prev, type: fileExt, name: fileName, url }));

        const image = new Image();
        image.src = url;
        image.onload = () => {
          setImage((prev) => ({ ...prev, element: image }));
        };
      }
    }
  };

  const handleUploadByBlob = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setImage((prev) => ({ ...prev, url }));

    const image = new Image();
    image.src = url;
    image.onload = () => {
      setImage((prev) => ({ ...prev, element: image }));
    };
  };

  const handlePaste = async () => {
    if (image.element || image.url) return;

    try {
      const blob = await getClipboardImage();

      if (blob) {
        handleUploadByBlob(blob);
      }
    } catch (error) {
      console.error(error);
      toast({
        duration: TOAST_DURATION,
        title: t("upload.paste_fail.title"),
        description: t("upload.paste_fail.desc"),
      });
    }
  }

  const resetImage = () => {
    setImage((prev) => ({
      ...prev,
      element: null,
      url: null,
      name: DEFAULT_IMAGE_NAME,
      type: null,
    }));
  };

  return {
    handleUpload,
    handleUploadByBlob,
    handlePaste,
    resetImage,
  };
};
