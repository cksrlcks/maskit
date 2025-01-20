import { atom } from "jotai";
import { imageAtom } from "./image";
import {
  DEFAULT_COLOR,
  DEFAULT_OPACITY,
  DEFAULT_SCALE_X,
  DEFAULT_SCALE_Y,
} from "@/constants/common";
import { CanvasAtom, OCRAtom } from "@/types/canvas";

export const defaultCavnasAtom = {
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
};

export const defaultOCRAtom = {
  isProcessing: false,
  isExectued: false,
  data: [],
};

export const canvasAtom = atom<CanvasAtom>(defaultCavnasAtom);
export const ocrAtom = atom<OCRAtom>(defaultOCRAtom);

export const displayScaleAtom = atom((get) => {
  const canvas = get(canvasAtom);
  const image = get(imageAtom);

  return Math.floor((canvas.width / (image.element?.width || 1)) * 100 * canvas.scale.x);
});
