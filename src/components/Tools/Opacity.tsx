import { useCanvasActions } from "@/actions/canvas";
import { canvasAtom } from "@/atoms/canvas";
import { Button, Popover, PopoverContent, PopoverTrigger, Slider } from "@/components/ui";
import { OPACITY_AMOUNT } from "@/constants/common";
import { useAtomValue } from "jotai";
import { Droplet } from "lucide-react";

export function Opacity() {
  const { opacity } = useAtomValue(canvasAtom);
  const { handleOpacity } = useCanvasActions();

  return (
    <div className="hidden sm:block">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <Droplet className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-36">
          <Slider
            defaultValue={[opacity]}
            onValueChange={([opacity]) => handleOpacity(opacity)}
            max={1}
            step={OPACITY_AMOUNT}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
