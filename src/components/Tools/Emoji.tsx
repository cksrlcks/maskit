import { Button, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { Smile } from "lucide-react";
import EmojiPicker from "../EmojiPicker/EmojiPicker";
import { useCanvasActions } from "@/actions/canvas";

export function Emoji() {
  const { handleEmoji } = useCanvasActions();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Smile className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-72">
        <EmojiPicker onClick={handleEmoji} />
      </PopoverContent>
    </Popover>
  );
}
