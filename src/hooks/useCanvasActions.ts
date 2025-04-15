import { useAtom, useAtomValue } from "jotai";
import { canvasAtom, displayScaleAtom, ocrAtom } from "@/atoms/canvas";
import { imageAtom } from "@/atoms/image";
import { calculateCanvasSize } from "@/lib/canvas";
import { toast } from "@/hooks/useToast";
import {
  canvasDownload,
  convertToFileBlob,
  copyClipboard,
  mergeCanvasWithImage,
} from "@/lib/canvas";
import { CanvasItem, handleImageType } from "@/types/canvas";
import { KonvaEventObject } from "konva/lib/Node";
import { v4 as uuidv4 } from "uuid";
import {
  APP_TITLE,
  DEFAULT_COLOR,
  DEFAULT_OPACITY,
  EMOJI_INITIAL_MIN_SIZE,
  MAX_DISPLAY_SCALE,
  MIN_DISPLAY_SCALE,
  PIXEL_RATIO,
  RECT_MIN_HEIGHT,
  RECT_MIN_WIDTH,
  TOAST_DURATION,
} from "@/constants/common";
import { useTranslation } from "react-i18next";

export const useCanvasActions = () => {
  const [canvas, setCanvas] = useAtom(canvasAtom);
  const image = useAtomValue(imageAtom);
  const ocr = useAtomValue(ocrAtom);
  const displayScale = useAtomValue(displayScaleAtom);
  const { t } = useTranslation();

  const handleImage = async (type: handleImageType) => {
    if (!canvas.stage || !image.element) return;

    const stage = canvas.stage;
    const mergedCanvas = mergeCanvasWithImage(
      stage.toCanvas({ pixelRatio: PIXEL_RATIO }),
      image.element,
    );

    if (!mergedCanvas) return;

    if (type === "download") {
      toast({
        duration: TOAST_DURATION,
        title: t("export.save_pre.title"),
        description: t("export.save_pre.desc"),
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
            title: APP_TITLE,
            files: [file],
          });
        } else {
          toast({
            duration: TOAST_DURATION,
            variant: "destructive",
            title: t("export.share_not_support.title"),
            description: t("export.share_not_support.desc"),
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          duration: TOAST_DURATION,
          variant: "destructive",
          title: t("export.share_error.title"),
          description: t("export.share_error.desc"),
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
        duration: TOAST_DURATION,
        variant: "destructive",
        title: t("export.copy_error.title"),
        description: t("export.share_error.desc"),
      });
    }

    if (type === "copy") {
      toast({
        duration: TOAST_DURATION,
        title: t("export.copy_success.title"),
        description: t("export.copy_success.desc"),
      });
    } else if (type === "mail") {
      toast({
        duration: TOAST_DURATION,
        title: t("export.mail_success.title"),
        description: t("export.mail_success.desc"),
      });

      const link = `mailto:?subject=${APP_TITLE}`;
      window.location.href = link;
    } else if (type === "kakao") {
      toast({
        duration: TOAST_DURATION,
        title: t("export.kakao_success.title"),
        description: t("export.kakao_success.desc"),
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
      setCanvas((prev) => {
        if (!prev.newRectangle) {
          return prev;
        }

        return {
          ...prev,
          newRectangle: {
            ...prev.newRectangle,
            width: position.x / canvas.scale.x - (prev.newRectangle?.x || 0),
            height: position.y / canvas.scale.y - (prev.newRectangle?.y || 0),
          },
        };
      });
    }
  };

  const handleMouseUp = () => {
    if (!canvas.newRectangle) return;

    const { width, height } = canvas.newRectangle;

    if (Math.abs(width || 0) > RECT_MIN_WIDTH && Math.abs(height || 0) > RECT_MIN_HEIGHT) {
      setCanvas((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            ...prev.newRectangle,
            id: `rect-${uuidv4()}`,
            type: "rect",
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
        duration: TOAST_DURATION,
        variant: "destructive",
        title: t("ocr.empty.title"),
        description: t("ocr.empty.desc"),
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

  const handleUpdateItems = (updated: CanvasItem) => {
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
    const fontSize = Math.min(canvas.width * 0.25, EMOJI_INITIAL_MIN_SIZE);

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
        displayScale > MAX_DISPLAY_SCALE || displayScale < MIN_DISPLAY_SCALE
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
