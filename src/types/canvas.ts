import Konva from "konva";
import { RectConfig } from "konva/lib/shapes/Rect";
import { TextConfig } from "konva/lib/shapes/Text";

export type handleImageType = "download" | "copy" | "mail" | "share" | "kakao";
export type ItemType = "emoji" | "rect" | "ocr";

export type RectItem = RectConfig & { type: ItemType; id: string };
export type TextItem = TextConfig & { type: ItemType; id: string };
export type CanvasItem = RectItem | TextItem;

export interface CanvasAtom {
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
  isLoading: boolean;
  items: CanvasItem[];
  blocks: CanvasItem[]; // 나중에 ocrblock이라고 이름바꾸기
  newRectangle: RectItem | null;
}

export interface OCRAtom {
  isProcessing: boolean;
  isExectued: boolean;
  data: RectItem[];
}

export interface ImageAtom {
  url: string | null;
  type: string | null;
  name: string;
  element: HTMLImageElement | null;
}
