import { Button, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { Sticker } from "lucide-react";

export function Stamp() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Sticker className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="flex items-center justify-center py-5 text-sm opacity-40">
          워터마크 준비중
        </div>
      </PopoverContent>
    </Popover>
  );
}
