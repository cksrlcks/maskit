import { useEffect, useState } from "react";

export default function useImage() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageType, setImageType] = useState<"jpg" | "jpeg" | "png" | "svg" | undefined>(undefined);

  // 이미지 url objecturl revoke
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  function handleUpload(files: File[]) {
    const file = files?.[0];
    if (file) {
      //todo : refactoring
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      if (fileExt === "jpg" || fileExt === "jpeg" || fileExt === "png" || fileExt === "svg") {
        setImageType(fileExt);
      } else {
        setImageType(undefined);
      }

      const url = URL.createObjectURL(file);
      setImageUrl(url);
      const img = new Image();

      img.src = url;
      img.onload = () => {
        setImage(img);
      };
    }
  }

  function handleUploadByBlob(blob: Blob) {
    const url = URL.createObjectURL(blob);
    setImageUrl(url);
    const img = new Image();

    img.src = url;
    img.onload = () => {
      setImage(img);
    };
  }

  function resetImage() {
    setImage(null);
    setImageUrl(null);
  }

  return {
    image,
    imageUrl,
    imageType,
    handleUpload,
    handleUploadByBlob,
    resetImage,
  };
}
