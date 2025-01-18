import {
  canvasSizeEffectAtom,
  ocrEffectAtom,
  outsideCanvasClickEffectAtom,
  responsiveScaleAtom,
  wheelZoomCanvasEffectAtom,
} from "@/atoms/effects";
import { imageAtom } from "@/atoms/image";
import { Canvas, Upload } from "@/components/Canvas";
import { useAtom, useAtomValue } from "jotai";

export function AppCanvas() {
  const image = useAtomValue(imageAtom);

  //effect 등록
  useAtom(canvasSizeEffectAtom);
  useAtom(responsiveScaleAtom);
  useAtom(ocrEffectAtom);
  useAtom(outsideCanvasClickEffectAtom);
  useAtom(wheelZoomCanvasEffectAtom);

  return !image.url ? <Upload /> : <Canvas />;
}
