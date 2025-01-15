import { ThemeMenu, ShareMenu, RootMenu, Logo, CanvasMenu, ZoomMenu } from "@/components/layer";
export function AppMenu() {
  return (
    <>
      <header className="pointer-events-none grid grid-flow-col grid-cols-3 gap-10">
        <div className="pointer-events-auto flex gap-4">
          <RootMenu />
          <Logo />
        </div>
        <div className="pointer-events-auto flex justify-center">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 md:relative md:left-auto md:transform-none">
            <CanvasMenu />
          </div>
        </div>
        <div className="pointer-events-auto flex justify-end gap-2">
          <ShareMenu />
          <ThemeMenu />
        </div>
      </header>
      <div className="pointer-events-auto">
        <div className="absolute bottom-0 right-0 hidden md:block">
          <ZoomMenu />
        </div>
      </div>
    </>
  );
}
