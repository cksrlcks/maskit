import { useCallback, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { toast } from "@/hooks/useToast";
import { RectConfig } from "konva/lib/shapes/Rect";
import { KonvaEventObject } from "konva/lib/Node";
import { createWorker, PSM } from "tesseract.js";
import { v4 as uuidv4 } from "uuid";
import { calculateCanvasSize } from "@/components/Canvas/helper";
import { useHotkeys } from "react-hotkeys-hook";
import {
  canvasDownload,
  convertToFileBlob,
  copyClipboard,
  mergeCanvasWithImage,
} from "@/lib/canvas";
import { ImageConfig } from "konva/lib/shapes/Image";
import useImage from "./useImage";
import { TextConfig } from "konva/lib/shapes/Text";

export interface Rect extends RectConfig {
  fill?: string;
}

type CanvasItemConfig = RectConfig | ImageConfig | TextConfig;

type handleImageType = "download" | "copy" | "mail" | "share" | "kakao";

export default function useCanvasApi() {
  const { image, imageUrl, imageType, imageName, handleUpload, handleUploadByBlob } = useImage();

  const [isLoading, setIsLoading] = useState(false);
  const [blocks, setBlocks] = useState<CanvasItemConfig[]>([]);
  const [items, setItems] = useState<CanvasItemConfig[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0, scale: { x: 1, y: 1 } });
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [newRectangle, setNewRectangle] = useState<Rect | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [color, setColor] = useState("#000");
  const [opacity, setOpacity] = useState(1);
  const [isOCRLoading, setIsOCRLoading] = useState(true);
  const [isOCRMode, setIsOCRMode] = useState(false);
  const [isMaskMode, setIsMaskMode] = useState(true);

  const stageRef = useRef<Konva.Stage | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const ocrResultRef = useRef<RectConfig[] | null>(null);

  const displayScale = Math.floor((canvasSize.width / (image?.width || 1)) * 100 * scale.x);

  const handleImage = useCallback(
    async function handleImage(type: handleImageType) {
      if (!stageRef.current || !image) return;
      const stage = stageRef.current;
      const canvas = mergeCanvasWithImage(stage.toCanvas({ pixelRatio: 2 }), image);

      if (!canvas) return;

      if (type === "download") {
        toast({
          duration: 2000,
          title: "이미지를 저장합니다.",
          description: "곧 이미지 저장이 시작됩니다.",
        });

        return canvasDownload(imageName, canvas);
      }

      if (type === "share") {
        setIsLoading(true);
        const file = await convertToFileBlob(canvas);
        setIsLoading(false);

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

        return;
      }

      try {
        setIsLoading(true);
        await copyClipboard(canvas);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        toast({
          duration: 2000,
          variant: "destructive",
          title: "문제가 발생했어요.",
          description: "예상치못한 에러가 발생하여, 이미지를 복사하지 못했습니다.",
        });
      }

      if (type === "copy") {
        toast({
          duration: 2000,
          title: "복사 완료",
          description: "성공적으로 클립보드에 이미지를 복사했습니다.",
        });
      } else if (type === "mail") {
        toast({
          duration: 2000,
          title: "복사 완료",
          description: "메일본문에 붙여넣기 해주세요",
        });

        const link = "mailto:?subject=MASKIT";
        window.location.href = link;
      } else if (type === "kakao") {
        toast({
          duration: 2000,
          title: "복사 완료",
          description: "카카오톡 메세지에서 붙여넣기 해주세요.",
        });

        window.open("kakaotalk://launch", "_blank");
      }
    },
    [image],
  );

  function handleSelected(id: string | null) {
    setSelectedId(id);
  }

  function handleMouseDown(e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>) {
    if (e.target !== e.target.getStage() || !stageRef.current) return;
    const position = stageRef.current.getPointerPosition();

    if (position) {
      setSelectedId(null);
      setNewRectangle({
        type: "rect",
        id: `rect-${uuidv4()}`,
        x: position.x / scale.x,
        y: position.y / scale.y,
        width: 0,
        height: 0,
      });
    }
  }

  function handleMouseMove() {
    if (!newRectangle || !stageRef.current) return;

    const position = stageRef.current.getPointerPosition();

    if (position) {
      setNewRectangle((prev) => {
        return {
          ...prev,
          width: position.x / scale.x - (prev?.x || 0),
          height: position.y / scale.y - (prev?.y || 0),
        };
      });
    }
  }

  function handleMouseUp() {
    if (!newRectangle) return;

    const { width, height } = newRectangle;

    if (Math.abs(width || 0) > 5 && Math.abs(height || 0) > 5) {
      setItems((prev) => [
        ...prev,
        {
          ...newRectangle,
          id: `rect-${uuidv4()}`,
        },
      ]);
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
    setItems([]);
    setOpacity(1);
    setColor("#000");
    setIsOCRMode(false);
    if (ocrResultRef.current) {
      setBlocks(ocrResultRef.current);
    }
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
    setIsMaskMode((prev) => !prev);
  }

  const handleSelectDelete = useCallback(
    function handleSelectDelete() {
      if (!selectedId) return;

      setBlocks((prev) => prev.filter((block) => block.id !== selectedId));
      setItems((prev) => prev.filter((item) => item.id !== selectedId));
      setSelectedId(null);
    },
    [selectedId],
  );

  function handleUpdateItems(updated: CanvasItemConfig) {
    if (updated.type === "ocr") {
      setBlocks((prev) => prev.map((rect) => (rect.id === updated.id ? updated : rect)));
    } else {
      setItems((prev) => {
        const item = prev.find((item) => item.id === updated.id);
        const filtered = prev.filter((item) => item.id !== updated.id);

        return [...filtered, { ...item, ...updated }];
      });
    }
  }

  function handleEmoji(code: string) {
    setItems((prev) => {
      const id = `emoji-${uuidv4()}`;
      const fontSize = canvasSize.width * 0.25;
      const scaledWidth = canvasSize.width;
      const scaledHeight = canvasSize.height;
      return [
        ...prev,
        {
          id,
          type: "emoji",
          x: (scaledWidth - fontSize) / 2 + (Math.floor(Math.random() * 200) - 100),
          y: (scaledHeight - fontSize) / 2 + (Math.floor(Math.random() * 200) - 100),
          text: code,
          fontSize,
        },
      ];
    });
  }

  function handleZoom(amount: number) {
    setScale((prev) => {
      if (displayScale > 200 || displayScale < 10) {
        return prev;
      }

      return { x: prev.x + amount, y: prev.x + amount };
    });
  }

  const handleResize = useCallback(
    function handleResize() {
      if (!image) return;
      const resizedSize = calculateCanvasSize(image);
      const scaleX = resizedSize.width / canvasSize.width;
      const scaleY = resizedSize.height / canvasSize.height;

      setScale({ x: scaleX, y: scaleY });
    },
    [canvasSize, image],
  );

  // 이미지로드시 캔버스 사이즈 설정
  useEffect(() => {
    if (!image) return;

    const canvasSize = calculateCanvasSize(image);
    setCanvasSize(canvasSize);
  }, [image]);

  // 반응형 캔버스 scale 업데이트
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // OCR
  useEffect(() => {
    if (!image || !imageUrl || blocks.length || canvasSize.width === 0) return;

    if (imageType === "svg") {
      toast({
        duration: 2000,
        variant: "destructive",
        title: "문자감지가 지원되지 않는 이미지 형식입니다.",
        description: "문자인식을 실패했습니다.",
      });
      setIsOCRLoading(false);
      return;
    }

    (async function getOCRData() {
      try {
        const worker = await createWorker(["kor", "eng"]);
        await worker.setParameters({
          tessedit_pageseg_mode: PSM.AUTO,
        });
        const { data } = await worker.recognize(image);

        const scaleX = canvasSize.width / image.width;
        const scaleY = canvasSize.height / image.height;

        const blocks = data.paragraphs.map((item) => ({
          id: `rect-${uuidv4()}`,
          x: item.bbox.x0 * scaleX,
          y: item.bbox.y0 * scaleY,
          width: (item.bbox.x1 - item.bbox.x0) * scaleX,
          height: (item.bbox.y1 - item.bbox.y0) * scaleY,
          type: "ocr",
        }));
        ocrResultRef.current = blocks.slice(0, -1);

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
  }, [image, canvasSize]);

  // 캔버스영역 바깥에서 클릭시
  useEffect(() => {
    function handleClickOutSizeCanvas(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest("[data-prevent-focusout]")) return;

      const stageContainer = stageRef.current?.container();
      if (stageContainer && !stageContainer.contains(e.target as Node)) {
        setSelectedId(null);

        // 마우스가 캔버스 밖으로 나가면, 그리고있던 사각형이 있으면 완성해주기
        if (newRectangle) {
          const { width, height } = newRectangle;
          if (Math.abs(width || 0) > 5 && Math.abs(height || 0) > 5) {
            setItems((prev) => {
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

  //휠줌
  useEffect(() => {
    function wheelZoom(e: WheelEvent) {
      if (e.ctrlKey || e.metaKey) {
        setScale((prev) => {
          if ((e.deltaY < 0 && displayScale > 200) || (e.deltaY > 0 && displayScale < 10)) {
            return prev;
          }

          const newScale = e.deltaY > 0 ? prev.x - 0.1 : prev.x + 0.1;
          return { x: newScale, y: newScale };
        });
      }
    }
    window.addEventListener("wheel", wheelZoom);
    return () => window.removeEventListener("wheel", wheelZoom);
  }, [displayScale]);

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
    isLoading,
    image,
    imageUrl,
    stageRef,
    containerRef,
    fileRef,
    canvasSize,
    scale,
    newRectangle,
    selectedId,
    color,
    opacity,
    isOCRLoading,
    isOCRMode,
    isMaskMode,
    blocks,
    items,
    displayScale,
    setScale,
    handleSelected,
    handleImage,
    handleUpload,
    handleUploadByBlob,
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
    handleUpdateItems,
    handleEmoji,
    handleZoom,
    handleResize,
  };
}
