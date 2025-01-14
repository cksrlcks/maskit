import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getClipboardImage() {
  try {
    const clipboardItems = await navigator.clipboard.read();

    const item = clipboardItems[0];
    if (!item) return;

    for (const type of item.types) {
      const blob = await item.getType(type);
      if (type.startsWith("image/")) {
        return blob;
      }
    }
  } catch (error) {
    console.error(error);
    throw Error("클립보드에서 이미지를 가져오는 중 오류가 발생했습니다:");
  }
}
