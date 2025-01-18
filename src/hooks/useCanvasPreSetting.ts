import { useEffect } from "react";

export default function useCanvasPreSetting() {
  // 캔버스모드일때 터치액션 방지 클래스 합입
  useEffect(() => {
    const htmlElement = document.querySelector("html");

    if (htmlElement) {
      htmlElement.classList.add("canvas-mode");
      return () => {
        htmlElement.classList.remove("canvas-mode");
      };
    }
  }, []);

  // 핀치줌 방지
  useEffect(() => {
    const preventTouchZoom = (e: TouchEvent) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (e.touches.length > 1 || (typeof e.scale === "number" && e.scale !== 1)) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchstart", preventTouchZoom, { passive: false });
    document.addEventListener("touchmove", preventTouchZoom, { passive: false });

    return () => {
      document.removeEventListener("touchstart", preventTouchZoom);
      document.removeEventListener("touchmove", preventTouchZoom);
    };
  }, []);

  return null;
}
