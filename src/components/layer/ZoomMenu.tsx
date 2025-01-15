import { useCanvas } from "@/context/CanvasContext";
import { Menu } from "@/components/Menu";
import { Zoom, ZoomReset } from "@/components/Tools";
export function ZoomMenu() {
  const { image, displayScale } = useCanvas();

  if (!image) {
    return null;
  }

  return (
    <Menu>
      <Menu.Group>
        <ZoomReset />
        <Menu.Seperator />
        <Zoom type="zoom-out" amount={-0.1} disabled={displayScale < 10} />
        <div className="w-[4em] px-2 text-center text-sm">{Math.min(displayScale, 200)}%</div>
        <Zoom type="zoom-in" amount={0.1} disabled={displayScale > 200} />
      </Menu.Group>
    </Menu>
  );
}
