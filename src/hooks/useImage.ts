import { ChangeEvent, useEffect, useState } from "react";

export default function useImage() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      const img = new Image();

      img.src = url;
      img.onload = () => {
        setImage(img);
      };
    }
  }

  function resetImage() {
    setImage(null);
    setImageUrl(null);
  }

  return {
    image,
    imageUrl,
    handleUpload,
    resetImage,
  };
}
