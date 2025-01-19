import { Menu } from "@/components/Menu";
import { Zoom, ZoomReset } from "@/components/Tools";
import { useAtomValue } from "jotai";
import { imageAtom } from "@/atoms/image";
import { displayScaleAtom } from "@/atoms/canvas";
import { MAX_DISPLAY_SCALE, MIN_DISPLAY_SCALE } from "@/constants/common";

export function ZoomMenu() {
  const image = useAtomValue(imageAtom);
  const displayScale = useAtomValue(displayScaleAtom);

  if (!image.element) {
    return null;
  }

  return (
    <Menu>
      <Menu.Group>
        <ZoomReset />
        <Menu.Seperator />
        <Zoom type="zoom-out" amount={-0.1} disabled={displayScale < MIN_DISPLAY_SCALE} />
        <div className="w-[4em] px-2 text-center text-sm">
          {Math.min(displayScale, MAX_DISPLAY_SCALE)}%
        </div>
        <Zoom type="zoom-in" amount={0.1} disabled={displayScale > MAX_DISPLAY_SCALE} />
      </Menu.Group>
    </Menu>
  );
}
