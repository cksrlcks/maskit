import { useEffect } from "react";
import { AppCanvas, AppProvider, AppDialog, AppFooter, AppLayer, AppMenu } from "./layouts";
import Welcome from "./components/Welcome/Welcome";

export default function App() {
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

  return (
    <AppProvider>
      <Welcome />
      <AppLayer>
        <AppMenu />
        <AppFooter />
      </AppLayer>
      <AppCanvas />
      <AppDialog />
    </AppProvider>
  );
}
