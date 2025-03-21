import { emojis as emojisGroup } from "@/constants/emoji";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { isSafari } from "react-device-detect";

interface EmojiPicker {
  onClick: (code: string) => void;
}

export default function EmojiPicker({ onClick }: EmojiPicker) {
  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const target = e.target as HTMLButtonElement;
    const code = target.dataset.code;
    if (code) {
      onClick(code);
    }
  }

  return (
    <Tabs defaultValue={emojisGroup[0].id} className={cn("w-full", !isSafari && "font-emoji")}>
      <TabsList className="w-full">
        {emojisGroup.map(({ id, emojis }) => (
          <TabsTrigger key={id} value={id}>
            <span className="pointer-events-none">{emojis[0]}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {emojisGroup.map(({ id, name, emojis }) => (
        <TabsContent key={id} value={id}>
          <h4 className="mb-4 py-2 text-xs opacity-40">{name}</h4>
          <ul className="grid grid-cols-5 gap-1">
            {emojis.map((emoji) => (
              <li key={emoji}>
                <button
                  type="button"
                  className="aspect-square w-full rounded-sm border border-transparent bg-muted p-1 text-xl hover:bg-slate-200 dark:hover:bg-white"
                  onClick={handleClick}
                  data-code={emoji}
                >
                  <span className="pointer-events-none">{emoji}</span>
                </button>
              </li>
            ))}
          </ul>
        </TabsContent>
      ))}
    </Tabs>
  );
}
