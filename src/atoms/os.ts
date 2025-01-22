import { atom } from "jotai";
import { OS } from "@/types/os";

function detectOS() {
  const platform = navigator.platform;
  const userAgent = navigator.userAgent;

  if (/Mac/.test(platform) && !/iPhone|iPad|iPod/.test(userAgent)) {
    return "MAC";
  }

  if (/^Win/.test(platform)) {
    return "WIN";
  }

  return "MOBILE";
}

export const osAtom = atom<OS>(detectOS());
