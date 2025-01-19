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
    throw Error("error");
  }
}

export function getFileNameAndExt(filePath: string) {
  const lastDotIndex = filePath.lastIndexOf(".");
  const name = filePath.slice(0, lastDotIndex);
  const ext = filePath.slice(lastDotIndex + 1);
  return [name, ext];
}
