import { Slider } from "@/components/ui";
import { HexColorPicker } from "react-colorful";
import { colorPallet } from "@/constants/color";
import clsx from "clsx";
import { useAtomValue } from "jotai";
import { canvasAtom } from "@/atoms/canvas";
import { useCanvasActions } from "@/actions/canvas";

export function ColorPicker() {
  const { color } = useAtomValue(canvasAtom);
  const { handleColor, handleOpacity } = useCanvasActions();

  return (
    <>
      <div className="mb-2">
        <HexColorPicker color={color} onChange={handleColor} style={{ width: "100%" }} />
      </div>
      <div className="flex gap-1">
        {colorPallet.map((code, index) => (
          <button
            key={index}
            type="button"
            className={clsx(
              "h-8 w-8 rounded-md dark:border",
              code === "#ffffff" && "border border-zinc-200",
            )}
            onClick={() => handleColor(code)}
            style={{ background: code }}
          >
            <span className="sr-only">{code}</span>
          </button>
        ))}
      </div>
      <div className="mb-2 mt-4 block sm:hidden">
        <Slider
          defaultValue={[1]}
          onValueChange={([opacity]) => handleOpacity(opacity)}
          max={1}
          step={0.1}
        />
      </div>
    </>
  );
}
