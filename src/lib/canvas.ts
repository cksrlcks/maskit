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
  try {
    //ios
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": new Promise((resolve) => {
          canvas.toBlob((blob) => resolve(blob!));
        }),
      }),
    ]);
  } catch {
    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((blob) => resolve(blob!), "image/png"),
    );
    //chrome
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob,
      }),
    ]);
  }
}

export async function convertToFileBlob(canvas: HTMLCanvasElement) {
  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((blob) => resolve(blob!), "image/png"),
  );

  return new File([blob], "maskit.png", { type: "image/png" });
}

export function canvasDownload(imageName: string, canvas: HTMLCanvasElement) {
  const link = document.createElement("a");
  link.download = `${imageName}_maskit.png`;
  link.href = canvas.toDataURL();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
