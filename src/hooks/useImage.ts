import { getFileNameAndExt } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function useImage() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageType, setImageType] = useState<"jpg" | "jpeg" | "png" | "svg" | "webp" | undefined>(
    undefined,
  );
  const [imageName, setImageName] = useState("");

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
      //todo : refactoring (enum 사용해보기)
      const [fileName, fileExt] = getFileNameAndExt(file.name);
      if (
        fileExt === "jpg" ||
        fileExt === "jpeg" ||
        fileExt === "png" ||
        fileExt === "svg" ||
        fileExt === "webp"
      ) {
        setImageType(fileExt);
        setImageName(fileName);

        const url = URL.createObjectURL(file);
        setImageUrl(url);
        const img = new Image();

        img.src = url;
        img.onload = () => {
          setImage(img);
        };
      }
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
    imageName,
    handleUpload,
    handleUploadByBlob,
    resetImage,
  };
}
