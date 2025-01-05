import { useEffect } from "react";
import { AppCanvas, AppProvider, AppDialog, AppFooter, AppLayer, AppMenu } from "./layouts";

export default function App() {
  useEffect(() => {
    // Block pinch-zooming on iOS outside of the content area
    const handleTouchMove = (event: TouchEvent) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (typeof event.scale === "number" && event.scale !== 1) {
        event.preventDefault();
      }
    };

    document.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <AppProvider>
      <AppLayer>
        <AppMenu />
        <AppFooter />
      </AppLayer>
      <AppCanvas />
      <AppDialog />
    </AppProvider>
  );
}
