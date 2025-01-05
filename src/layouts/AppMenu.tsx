import { ThemeMenu, ShareMenu, RootMenu, Logo, CanvasMenu } from "@/components/layer";
export function AppMenu() {
  return (
    <header className="pointer-events-none grid grid-flow-col grid-cols-3 gap-10">
      <div className="pointer-events-auto flex gap-4">
        <RootMenu />
        <Logo />
      </div>
      <div className="pointer-events-auto flex justify-center">
        <CanvasMenu />
      </div>
      <div className="pointer-events-auto flex justify-end gap-2">
        <ShareMenu />
        <ThemeMenu />
      </div>
    </header>
  );
}
