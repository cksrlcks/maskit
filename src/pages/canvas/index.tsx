import { AppCanvas, AppProvider, AppDialog, AppFooter, AppLayer, AppMenu } from "@/layouts";
import { Welcome } from "@/components/Welcome";
import useCanvasPreSetting from "@/hooks/useCanvasPreSetting";
import useCanvasShortcuts from "@/hooks/useCanvasShortcuts";
import { Provider } from "jotai";

export default function CanvasPage() {
  useCanvasPreSetting();
  useCanvasShortcuts();

  return (
    <Provider>
      <AppProvider>
        <Welcome />
        <AppLayer>
          <AppMenu />
          <AppFooter />
        </AppLayer>
        <AppCanvas />
        <AppDialog />
      </AppProvider>
    </Provider>
  );
}
