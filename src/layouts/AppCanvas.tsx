import {
  canvasSizeEffectAtom,
  ocrEffectAtom,
  outsideCanvasClickEffectAtom,
  responsiveScaleAtom,
  wheelZoomCanvasEffectAtom,
  clearOnUnmount,
} from "@/atoms/effects";
import { imageAtom } from "@/atoms/image";
import { Canvas, Upload } from "@/components/Canvas";
import useCanvasShortcuts from "@/hooks/useCanvasShortcuts";
import { useAtom, useAtomValue } from "jotai";

export function AppCanvas() {
  const image = useAtomValue(imageAtom);

  //canvas hotkey 등록
  useCanvasShortcuts();

  //effect 등록
  useAtom(canvasSizeEffectAtom);
  useAtom(responsiveScaleAtom);
  useAtom(ocrEffectAtom);
  useAtom(outsideCanvasClickEffectAtom);
  useAtom(wheelZoomCanvasEffectAtom);
  useAtom(clearOnUnmount);

  return !image.url ? <Upload /> : <Canvas />;
}
