import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { toast } from "@/hooks/useToast";
import { RectConfig } from "konva/lib/shapes/Rect";
import { KonvaEventObject } from "konva/lib/Node";
import { createWorker, PSM } from "tesseract.js";
import { v4 as uuidv4 } from "uuid";
import { calculateCanvasSize } from "@/components/Canvas/helper";
import { useHotkeys } from "react-hotkeys-hook";

export interface Rect extends RectConfig {
  fill: string;
}

type handleImageType = "download" | "copy" | "mail" | "share" | "kakao";

export default function useCanvasApi() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0, scale: { x: 1, y: 1 } });
  const [rectangles, setRectangles] = useState<Rect[]>([]);
  const [newRectangle, setNewRectangle] = useState<Rect | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [color, setColor] = useState("#000");
  const [opacity, setOpacity] = useState(1);
  const [isOCRLoading, setIsOCRLoading] = useState(true);
  const [isOCRMode, setIsOCRMode] = useState(false);
  const [isHide, setIsHide] = useState(true);
  const [blocks, setBlocks] = useState<Partial<Rect>[]>([]);

  const isDrawing = useRef(false);
  const stageRef = useRef<Konva.Stage | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);

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

  const handleImage = useCallback(
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
    },
    [image, imageUrl],
  );

  function handleSelected(id: string | null) {
    setSelectedId(id);
  }

  function handleMouseDown(e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>) {
    const stage = e.target.getStage();
    const position = stage?.getPointerPosition();
    if (e.target !== e.target.getStage()) return;
    if (!position) return;

    setSelectedId(null);
    isDrawing.current = true;

    const x = position.x / canvasSize.scale.x;
    const y = position.y / canvasSize.scale.y;

    setNewRectangle({
      x,
      y,
      width: 0,
      height: 0,
      fill: color,
      opacity,
    });
  }

  function handleMouseMove(e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>) {
    if (!newRectangle) return;

    const stage = e.target.getStage();
    const position = stage?.getPointerPosition();

    if (!position || !stage) return;

    const x = position.x / canvasSize.scale.x;
    const y = position.y / canvasSize.scale.y;

    const prevX = newRectangle.x || 0;
    const prevY = newRectangle.y || 0;

    const width = x - prevX;
    const height = y - prevY;

    setNewRectangle((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        width: width,
        height: height,
        x: prevX,
        y: prevY,
      };
    });
  }

  function handleMouseUp() {
    if (!newRectangle) return;

    isDrawing.current = false;

    const { width, height } = newRectangle;
    if (Math.abs(width || 0) > 5 && Math.abs(height || 0) > 5) {
      setRectangles((prev) => {
        return [...prev, { ...newRectangle, id: `rect-${uuidv4()}` }];
      });
    }
    setNewRectangle(null);
  }

  function handleColor(color: string) {
    setColor(color);
  }

  function handleOpacity(opactiy: number) {
    setOpacity(opactiy);
  }

  function handleReset() {
    setRectangles([]);
    setOpacity(1);
    setColor("#000");
    setIsOCRMode(false);
  }

  function handleOCRMode() {
    if (blocks.length === 0) {
      toast({
        duration: 2000,
        variant: "destructive",
        title: "감지된 영역 없음",
        description: "문자인식이 잘 안되요.",
      });
    }
    setIsOCRMode((prev) => !prev);
  }

  function handleRefresh() {
    window.location.reload();
  }

  function handleToggleHide() {
    setIsHide((prev) => !prev);
  }

  const handleSelectDelete = useCallback(
    function handleSelectDelete() {
      if (!selectedId) return;

      setBlocks(blocks.filter((block) => block.id !== selectedId));
      setRectangles(rectangles.filter((rect) => rect.id !== selectedId));
      setSelectedId(null);
    },
    [blocks, rectangles, selectedId],
  );

  function handleUpdateRect(updatedRect: Rect) {
    setRectangles((prev) => prev.map((rect) => (rect.id === updatedRect.id ? updatedRect : rect)));
    setBlocks((prev) => prev.map((rect) => (rect.id === updatedRect.id ? updatedRect : rect)));
  }

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  useEffect(() => {
    function handleCanvasLimitSize() {
      if (!image) return;
      const canvasSize = calculateCanvasSize(image);
      setCanvasSize(canvasSize);
    }

    handleCanvasLimitSize();

    window.addEventListener("resize", handleCanvasLimitSize);

    return () => {
      window.removeEventListener("resize", handleCanvasLimitSize);
    };
  }, [image]);

  useEffect(() => {
    if (!image || blocks.length) return;

    (async function getOCRData() {
      try {
        const worker = await createWorker(["kor", "eng"]);
        await worker.setParameters({
          tessedit_pageseg_mode: PSM.AUTO,
        });

        const { data } = await worker.recognize(image);
        const blocks = data.paragraphs.map((item) => ({
          x: item.bbox.x0,
          y: item.bbox.y0,
          width: item.bbox.x1 - item.bbox.x0,
          height: item.bbox.y1 - item.bbox.y0,
          id: `rect-${uuidv4()}`,
        }));

        setBlocks(blocks.slice(0, -1));

        await worker.terminate();
      } catch (error) {
        console.error(error);

        toast({
          duration: 2000,
          variant: "destructive",
          title: "자동감지 실패",
          description: "문자인식을 실패했습니다.",
        });
      } finally {
        setIsOCRLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  useEffect(() => {
    function handleClickOutSizeCanvas(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest("[data-prevent-focusout]")) return;

      const stageContainer = stageRef.current?.container();
      if (stageContainer && !stageContainer.contains(e.target as Node)) {
        setSelectedId(null);

        // 마우스가 캔버스 밖으로 나가면, 그리고있던 사각형이 있으면 완성해주기
        if (newRectangle) {
          isDrawing.current = false;
          const { width, height } = newRectangle;
          if (Math.abs(width || 0) > 5 && Math.abs(height || 0) > 5) {
            setRectangles((prev) => {
              return [...prev, { ...newRectangle, id: `rect-${uuidv4()}` }];
            });
          }
          setNewRectangle(null);
        }
      }
    }

    document.addEventListener("click", handleClickOutSizeCanvas);

    return () => {
      document.removeEventListener("click", handleClickOutSizeCanvas);
    };
  }, [newRectangle]);

  useHotkeys("cmd+s, ctrl+s, meta+s", (e) => {
    e.preventDefault();
    handleImage("download");
  });

  useHotkeys("cmd+c, ctrl+c, meta+c", (e) => {
    e.preventDefault();
    handleImage("copy");
  });

  useHotkeys("backspace, delete", (e) => {
    e.preventDefault();
    handleSelectDelete();
  });

  return {
    stageRef,
    containerRef,
    fileRef,
    transformerRef,
    image,
    imageUrl,
    canvasSize,
    rectangles,
    newRectangle,
    selectedId,
    color,
    opacity,
    isOCRLoading,
    isOCRMode,
    isHide,
    blocks,
    handleSelected,
    handleImage,
    handleUpload,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleColor,
    handleOpacity,
    handleReset,
    handleOCRMode,
    handleRefresh,
    handleToggleHide,
    handleSelectDelete,
    handleUpdateRect,
  };
}
