import { Button, Popover, PopoverContent, PopoverTrigger, Slider } from "@/components/ui";
import { useCanvas } from "@/context/CanvasContext";
import { Droplet } from "lucide-react";

export function Opacity() {
  const { handleOpacity } = useCanvas();

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
            defaultValue={[1]}
            onValueChange={([opacity]) => handleOpacity(opacity)}
            max={1}
            step={0.1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
