import {
  ChangeEvent,
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Konva from "konva";
import { toast } from "@/hooks/use-toast";

type handleImageType = "download" | "copy" | "mail" | "share" | "kakao";

type CanvasContextProps = {
  stageRef: MutableRefObject<Konva.Stage | null>;
  image: HTMLImageElement | null;
  imageUrl: string | null;
  handleUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  handleImage: (type: handleImageType) => void;
};

const CanvasContext = createContext<CanvasContextProps | null>(null);

export function CanvasProvider({ children }: PropsWithChildren) {
  const stageRef = useRef<Konva.Stage | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
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

  function handleImage(type: handleImageType) {
    if (!stageRef.current || !imageUrl || !image) return;

    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    if (!context) return;

    const backgroundImage = new Image();
    backgroundImage.src = imageUrl;

    backgroundImage.onload = async () => {
      context.drawImage(backgroundImage, 0, 0, image.width, image.height);

      const stageWidth = stageRef.current?.width() || 0;
      const stageHeight = stageRef.current?.height() || 0;
      const stageCanvas = stageRef.current?.toCanvas();

      if (stageCanvas) {
        context.drawImage(
          stageCanvas,
          0,
          0,
          stageWidth,
          stageHeight,
          0,
          0,
          image.width,
          image.height,
        );
      }

      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob!), "image/png"),
      );

      if (type === "download") {
        const link = document.createElement("a");
        link.download = "maskit.png";
        link.href = canvas.toDataURL();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          duration: 2000,
          title: "이미지를 저장합니다.",
          description: "곧 이미지 저장이 시작됩니다.",
        });
      } else if (type === "copy") {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              "image/png": blob,
            }),
          ]);

          toast({
            duration: 2000,
            title: "복사 완료",
            description: "성공적으로 클립보드에 이미지를 복사했습니다.",
          });
        } catch (error) {
          console.error(error);
          toast({
            duration: 2000,
            variant: "destructive",
            title: "문제가 발생했어요.",
            description: "예상치못한 에러가 발생하여, 이미지를 복사하지 못했습니다.",
          });
        }
      } else if (type === "share") {
        const file = new File([blob], "maskit.png", { type: "image/png" });

        try {
          if (navigator.share) {
            await navigator.share({
              title: "MASKIT",
              files: [file],
            });
          } else {
            toast({
              duration: 2000,
              variant: "destructive",
              title: "문제가 발생했어요.",
              description: "공유하기가 지원되지 않는 브라우저입니다.",
            });
          }
        } catch (error) {
          console.error(error);
          toast({
            duration: 2000,
            variant: "destructive",
            title: "공유 중단",
            description: "공유하기를 중단하였거나 문제가 있습니다.",
          });
        }
      } else if (type === "mail") {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              "image/png": blob,
            }),
          ]);

          toast({
            duration: 2000,
            title: "복사 완료",
            description: "메일본문에 붙여넣기 해주세요",
          });

          const link = "mailto:?subject=MASKIT";
          window.location.href = link;
        } catch (error) {
          console.log(error);

          toast({
            duration: 2000,
            variant: "destructive",
            title: "문제가 발생했어요.",
            description: "예상치못한 에러가 발생하여, 이미지를 복사하지 못했습니다.",
          });
        }
      } else if (type === "kakao") {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              "image/png": blob,
            }),
          ]);

          window.open("kakaotalk://launch", "_blank");

          toast({
            duration: 2000,
            title: "복사 완료",
            description: "카카오톡 메세지에서 붙여넣기 해주세요.",
          });
        } catch (error) {
          console.error(error);

          toast({
            duration: 2000,
            variant: "destructive",
            title: "문제가 발생했어요.",
            description: "예상치못한 에러가 발생하여, 이미지를 복사하지 못했습니다.",
          });
        }
      }
    };
  }

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const value = {
    stageRef,
    image,
    imageUrl,
    handleImage,
    handleUpload,
  };

  return <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>;
}

export function useCanvas() {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("Canvas Context는 Canvas Provider 내부에서 사용가능합니다.");
  }

  return context;
}
