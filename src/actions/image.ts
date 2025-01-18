import { useSetAtom } from "jotai";
import { imageAtom } from "@/atoms/image";
import { getFileNameAndExt } from "@/lib/utils";
import { DEFAULT_IMAGE_NAME } from "@/constants/common";

export const useImageActions = () => {
  const setImage = useSetAtom(imageAtom);

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
    resetImage,
  };
};
