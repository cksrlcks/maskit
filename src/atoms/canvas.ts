import { atom } from "jotai";
import { imageAtom } from "./image";
import Konva from "konva";
import { RectConfig } from "konva/lib/shapes/Rect";
import { ImageConfig } from "konva/lib/shapes/Image";
import { TextConfig } from "konva/lib/shapes/Text";

export const DEFAULT_COLOR = "#000";
export const DEFAULT_OPACITY = 1;
export const DEFAULT_SCALE_X = 1;
export const DEFAULT_SCALE_Y = 1;

export type CanvasItemConfig = RectConfig | ImageConfig | TextConfig;
interface Rect extends RectConfig {
  fill?: string;
}

interface Canvas {
  width: number;
  height: number;
  scale: {
    x: number;
    y: number;
  };
  stage: Konva.Stage | null;
  selectedId: string | null;
  color: string;
  opacity: number;
  isOCRMode: boolean;
  isMaskMode: boolean;
  isLoading: boolean; // 앱전체 로딩으로 빼야할듯

  items: CanvasItemConfig[];
  blocks: CanvasItemConfig[]; // 나중에 ocrblock이라고 이름바꾸기

  newRectangle: Rect | null;
}

export const canvasAtom = atom<Canvas>({
  width: 0,
  height: 0,
  scale: {
    x: DEFAULT_SCALE_X,
    y: DEFAULT_SCALE_Y,
  },
  stage: null,
  selectedId: null,
  color: DEFAULT_COLOR,
  opacity: DEFAULT_OPACITY,
  isOCRMode: false,
  isMaskMode: true,
  isLoading: false,
  items: [],
  blocks: [],
  newRectangle: null,
});

interface OCR {
  isProcessing: boolean;
  isExectued: boolean;
  data: RectConfig[];
}

export const ocrAtom = atom<OCR>({
  isProcessing: false,
  isExectued: false,
  data: [],
});

export const displayScaleAtom = atom((get) => {
  const canvas = get(canvasAtom);
  const image = get(imageAtom);

  return Math.floor((canvas.width / (image.element?.width || 1)) * 100 * canvas.scale.x);
});
