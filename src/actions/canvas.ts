import {
  canvasAtom,
  CanvasItemConfig,
  DEFAULT_COLOR,
  DEFAULT_OPACITY,
  displayScaleAtom,
  ocrAtom,
} from "@/atoms/canvas";
import { imageAtom } from "@/atoms/image";
import { calculateCanvasSize } from "@/components/Canvas/helper";
import { toast } from "@/hooks/useToast";
import {
  canvasDownload,
  convertToFileBlob,
  copyClipboard,
  mergeCanvasWithImage,
} from "@/lib/canvas";
import { useAtom, useAtomValue } from "jotai";
import { KonvaEventObject } from "konva/lib/Node";
import { v4 as uuidv4 } from "uuid";

type handleImageType = "download" | "copy" | "mail" | "share" | "kakao";

export const useCanvasActions = () => {
  const [canvas, setCanvas] = useAtom(canvasAtom);
  const image = useAtomValue(imageAtom);
  const ocr = useAtomValue(ocrAtom);
  const displayScale = useAtomValue(displayScaleAtom);

  const handleImage = async (type: handleImageType) => {
    if (!canvas.stage || !image.element) return;

    const stage = canvas.stage;
    const mergedCanvas = mergeCanvasWithImage(stage.toCanvas({ pixelRatio: 2 }), image.element);

    if (!mergedCanvas) return;

    if (type === "download") {
      toast({
        duration: 2000,
        title: "이미지를 저장합니다.",
        description: "곧 이미지 저장이 시작됩니다.",
      });

      return canvasDownload(image.name, mergedCanvas);
    }

    if (type === "share") {
      setCanvas((prev) => ({ ...prev, isLoading: true }));
      const file = await convertToFileBlob(mergedCanvas);
      setCanvas((prev) => ({ ...prev, isLoading: false }));

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
      setCanvas((prev) => ({ ...prev, isLoading: true }));
      await copyClipboard(mergedCanvas);
      setCanvas((prev) => ({ ...prev, isLoading: false }));
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
  };

  const handleSelected = (id: string | null) => {
    setCanvas((prev) => ({ ...prev, selectedId: id }));
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>) => {
    if (e.target !== e.target.getStage() || !canvas.stage) return;
    const position = canvas.stage.getPointerPosition();

    if (position) {
      setCanvas((prev) => ({
        ...prev,
        selectedId: null,
        newRectangle: {
          type: "rect",
          id: `rect-${uuidv4()}`,
          x: position.x / canvas.scale.x,
          y: position.y / canvas.scale.y,
          width: 0,
          height: 0,
        },
      }));
    }
  };

  const handleMouseMove = () => {
    if (!canvas.newRectangle || !canvas.stage) return;
    const position = canvas.stage.getPointerPosition();

    if (position) {
      setCanvas((prev) => ({
        ...prev,
        newRectangle: {
          ...prev.newRectangle,
          width: position.x / canvas.scale.x - (prev.newRectangle?.x || 0),
          height: position.y / canvas.scale.y - (prev.newRectangle?.y || 0),
        },
      }));
    }
  };

  const handleMouseUp = () => {
    if (!canvas.newRectangle) return;

    const { width, height } = canvas.newRectangle;

    if (Math.abs(width || 0) > 5 && Math.abs(height || 0) > 5) {
      setCanvas((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            ...prev.newRectangle,
            id: `rect-${uuidv4()}`,
          },
        ],
      }));
    }

    setCanvas((prev) => ({ ...prev, newRectangle: null }));
  };

  const handleColor = (color: string) => {
    setCanvas((prev) => ({ ...prev, color }));
  };

  const handleOpacity = (opacity: number) => {
    setCanvas((prev) => ({ ...prev, opacity }));
  };

  const handleReset = () => {
    setCanvas((prev) => ({
      ...prev,
      items: [],
      opacity: DEFAULT_OPACITY,
      color: DEFAULT_COLOR,
      isOCRMode: false,
      blocks: ocr.data,
    }));
  };

  // todo : 이름 통일 시키기 (handleToggleOCRMode)
  const handleOCRMode = () => {
    if (canvas.blocks.length === 0) {
      toast({
        duration: 2000,
        variant: "destructive",
        title: "감지된 영역 없음",
        description: "문자인식이 잘 안되요.",
      });
    }
    setCanvas((prev) => ({ ...prev, isOCRMode: !prev.isOCRMode }));
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // todo : 이름 통일 시키기 (handleToggleMaskMode)
  const handleToggleHide = () => {
    setCanvas((prev) => ({ ...prev, isMaskMode: !prev.isMaskMode }));
  };

  const handleSelectDelete = () => {
    if (!canvas.selectedId) return;

    setCanvas((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((block) => block.id !== canvas.selectedId),
      items: prev.items.filter((item) => item.id !== canvas.selectedId),
      selectedId: null,
    }));
  };

  const handleUpdateItems = (updated: CanvasItemConfig) => {
    if (updated.type === "ocr") {
      setCanvas((prev) => ({
        ...prev,
        blocks: prev.blocks.map((block) => (block.id === updated.id ? updated : block)),
      }));
    } else {
      setCanvas((prev) => {
        const item = prev.items.find((item) => item.id === updated.id);
        const filterd = prev.items.filter((item) => item.id !== updated.id);

        return { ...prev, items: [...filterd, { ...item, ...updated }] };
      });
    }
  };

  const handleEmoji = (code: string) => {
    const fontSize = canvas.width * 0.25;

    setCanvas((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: `emoji-${uuidv4()}`,
          type: "emoji",
          x: (canvas.width - fontSize) / 2 + (Math.floor(Math.random() * 200) - 100),
          y: (canvas.height - fontSize) / 2 + (Math.floor(Math.random() * 200) - 100),
          text: code,
          fontSize: fontSize,
        },
      ],
    }));
  };

  const handleZoom = (amount: number) => {
    setCanvas((prev) => {
      const newScale =
        displayScale > 200 || displayScale < 10
          ? prev.scale
          : { x: prev.scale.x + amount, y: prev.scale.y + amount };

      return { ...prev, scale: newScale };
    });
  };

  const handleResize = () => {
    if (!image.element) return;

    const resizedSize = calculateCanvasSize(image.element);
    const scaleX = resizedSize.width / canvas.width;
    const scaleY = resizedSize.height / canvas.height;

    setCanvas((prev) => ({ ...prev, scale: { x: scaleX, y: scaleY } }));
  };

  return {
    handleImage,
    handleSelected,
    handleMouseDown,
    handleMouseMove,
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
};
