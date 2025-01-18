import { atom } from "jotai";

export const DEFAULT_IMAGE_NAME = "maskit";

interface Image {
  url: string | null;
  type: string | null;
  name: string;
  element: HTMLImageElement | null;
}

export const imageAtom = atom<Image>({
  url: null,
  type: null,
  name: DEFAULT_IMAGE_NAME,
  element: null,
});
