import { Button, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { ColorPicker } from "../ColorPicker";
import { useAtomValue } from "jotai";
import { canvasAtom } from "@/atoms/canvas";

export function Color() {
  const { color } = useAtomValue(canvasAtom);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" title="zinc">
          <span
            className="h-[1.2rem] w-[1.2rem] rounded-sm border"
            style={{ background: color }}
          ></span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <ColorPicker />
      </PopoverContent>
    </Popover>
  );
}
