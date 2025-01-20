import { atom } from "jotai";
import { DEFAULT_IMAGE_NAME } from "@/constants/common";
import { ImageAtom } from "@/types/canvas";

export const defaultImageAtom = {
  url: null,
  type: null,
  name: DEFAULT_IMAGE_NAME,
  element: null,
};

export const imageAtom = atom<ImageAtom>(defaultImageAtom);
