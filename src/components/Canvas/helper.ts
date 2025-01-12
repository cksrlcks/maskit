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

  const limitWidth = Math.round(browserWidth * 0.8);
  const limitHeight = Math.min(Math.round(browserHeight * 0.8), browserHeight - 200);

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
