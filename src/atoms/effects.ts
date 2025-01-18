import { atomEffect } from "jotai-effect";
import { imageAtom } from "./image";
import { calculateCanvasSize } from "@/components/Canvas/helper";
import { canvasAtom, displayScaleAtom, ocrAtom } from "./canvas";
import { toast } from "@/hooks/useToast";
import { createWorker, PSM } from "tesseract.js";
import { v4 as uuidv4 } from "uuid";

export const canvasSizeEffectAtom = atomEffect((get, set) => {
  const image = get(imageAtom);

  if (!image.element) return;

  const canvasSize = calculateCanvasSize(image.element);
  set(canvasAtom, (prev) => ({ ...prev, ...canvasSize }));
});

export const responsiveScaleAtom = atomEffect((get, set) => {
  const handleResize = () => {
    const image = get(imageAtom);
    const canvas = get(canvasAtom);

    if (!image.element) return;

    const resizedSize = calculateCanvasSize(image.element);
    const scaleX = resizedSize.width / canvas.width;
    const scaleY = resizedSize.height / canvas.height;

    set(canvasAtom, (prev) => ({ ...prev, scale: { x: scaleX, y: scaleY } }));
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
});

export const ocrEffectAtom = atomEffect((get, set) => {
  const image = get(imageAtom);
  const canvas = get(canvasAtom);
  const ocr = get(ocrAtom);

  if (
    !image.element ||
    ocr.isExectued ||
    canvas.width === 0 ||
    canvas.height === 0 ||
    ocr.isProcessing
  )
    return;

  if (image.type === "svg") {
    toast({
      duration: 2000,
      variant: "destructive",
      title: "문자감지가 지원되지 않는 이미지 형식입니다.",
      description: "문자인식을 실패했습니다.",
    });
    set(ocrAtom, (prev) => ({ ...prev, isExectued: true }));
    return;
  }

  (async function getOCRData() {
    if (!image.element) return;

    try {
      set(ocrAtom, (prev) => ({ ...prev, isProcessing: true }));

      const worker = await createWorker(["kor", "eng"]);
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.AUTO,
      });
      const { data } = await worker.recognize(image.element);

      const scaleX = canvas.width / image.element.width;
      const scaleY = canvas.height / image.element.height;

      const blocks = data.paragraphs
        .map((item) => ({
          id: `rect-${uuidv4()}`,
          x: item.bbox.x0 * scaleX,
          y: item.bbox.y0 * scaleY,
          width: (item.bbox.x1 - item.bbox.x0) * scaleX,
          height: (item.bbox.y1 - item.bbox.y0) * scaleY,
          type: "ocr",
        }))
        .slice(0, -1); // 맨마지막 사각형이 전체를 다가려버리는것 같아서 하나뺌

      set(ocrAtom, (prev) => ({ ...prev, data: blocks }));
      set(canvasAtom, (prev) => ({ ...prev, blocks }));

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
      set(ocrAtom, (prev) => ({ ...prev, isProcessing: false, isExectued: true }));
    }
  })();
});

export const outsideCanvasClickEffectAtom = atomEffect((get, set) => {
  const handleClickOutSizeCanvas = (e: MouseEvent) => {
    const canvas = get(canvasAtom);
    const target = e.target as HTMLElement;
    if (target.closest("[data-prevent-focusout]")) return;

    const stageContainer = canvas.stage?.container();

    if (stageContainer && !stageContainer.contains(e.target as Node)) {
      set(canvasAtom, (prev) => ({ ...prev, selectedId: null }));

      // 마우스가 캔버스 밖으로 나가면, 그리고있던 사각형이 있으면 완성해주기
      if (canvas.newRectangle) {
        const { width, height } = canvas.newRectangle;
        if (Math.abs(width || 0) > 5 && Math.abs(height || 0) > 5) {
          set(canvasAtom, (prev) => ({
            ...prev,
            items: [...prev.items, { ...canvas.newRectangle, id: `rect-${uuidv4()}` }],
          }));
        }

        set(canvasAtom, (prev) => ({ ...prev, newRectangle: null }));
      }
    }
  };

  document.addEventListener("click", handleClickOutSizeCanvas);

  return () => {
    document.removeEventListener("click", handleClickOutSizeCanvas);
  };
});

export const wheelZoomCanvasEffectAtom = atomEffect((get, set) => {
  const wheelZoom = (e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const displayScale = get(displayScaleAtom);

      set(canvasAtom, (prev) => {
        if ((e.deltaY < 0 && displayScale > 200) || (e.deltaY > 0 && displayScale < 10)) {
          return prev;
        }

        const newScale = e.deltaY > 0 ? prev.scale.x - 0.1 : prev.scale.x + 0.1;

        return { ...prev, scale: { x: newScale, y: newScale } };
      });
    }
  };

  window.addEventListener("wheel", wheelZoom, { passive: false });
  return () => window.removeEventListener("wheel", wheelZoom);
});
