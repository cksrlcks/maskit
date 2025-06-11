import { DEFAULT_IMAGE_NAME, MIN_BOTTOM_SPACE, VIEWPORT_FACTOR } from "@/constants/common";

export function calculateCanvasSize({
  width: imageWidth,
  height: imageHeight,
}: {
  width: number;
  height: number;
}) {
  const ratio = imageWidth / imageHeight;
  const browserWidth = window.innerWidth;
  const browserHeight = window.innerHeight;

  let targetWidth = imageWidth;
  let targetHeight = imageHeight;

  const limitWidth = Math.round(browserWidth * VIEWPORT_FACTOR);
  const limitHeight = Math.min(
    Math.round(browserHeight * VIEWPORT_FACTOR),
    browserHeight - MIN_BOTTOM_SPACE,
  );

  if (ratio > 1) {
    if (targetWidth > limitWidth) {
      targetWidth = limitWidth;
      targetHeight = targetWidth / ratio;
    }

    if (targetHeight > limitHeight) {
      targetHeight = limitHeight;
      targetWidth = targetHeight * ratio;
    }
  } else {
    if (targetHeight > limitHeight) {
      targetHeight = limitHeight;
      targetWidth = targetHeight * ratio;
    }

    if (targetWidth > limitWidth) {
      targetWidth = limitWidth;
      targetHeight = targetWidth / ratio;
    }
  }

  return {
    width: Math.round(targetWidth),
    height: Math.round(targetHeight),
    scale: {
      x: 1,
      y: 1,
    },
  };
}

export function mergeCanvasWithImage(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const _canvas = document.createElement("canvas");
  _canvas.width = image.width;
  _canvas.height = image.height;
  const context = _canvas.getContext("2d");

  if (!context) return null;
  context.drawImage(image, 0, 0, image.width, image.height);
  context.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, image.width, image.height);

  return _canvas;
}

export async function copyClipboard(canvas: HTMLCanvasElement) {
  await navigator.clipboard.write([
    new ClipboardItem({
      "image/png": new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob!));
      }),
    }),
  ]);
}

export async function convertToFileBlob(canvas: HTMLCanvasElement) {
  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((blob) => resolve(blob!), "image/png"),
  );

  return new File([blob], `${DEFAULT_IMAGE_NAME}.png`, { type: "image/png" });
}

export function canvasDownload(imageName: string, canvas: HTMLCanvasElement) {
  const link = document.createElement("a");
  link.download = `${imageName}_${DEFAULT_IMAGE_NAME}.png`;
  link.href = canvas.toDataURL();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
