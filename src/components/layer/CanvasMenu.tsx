import { Separator } from "@/components/ui";
import { useCanvas } from "@/context/CanvasContext";
import { Color, Emoji, Image, Opacity, Stamp, Reset, Eye, Delete, Ocr } from "../Tools";
import { PropsWithChildren } from "react";

export function CanvasMenu() {
  const { image } = useCanvas();

  if (!image) {
    return null;
  }

  return (
    <Menu>
      <MenuGroup>
        <Color />
        <Opacity />
        <Stamp />
        <Emoji />
      </MenuGroup>
      <MenuSeprator />
      <MenuGroup>
        <Image />
        <Reset />
        <Eye />
        <Delete />
      </MenuGroup>
      <MenuSeprator />
      <MenuGroup>
        <Ocr />
      </MenuGroup>
    </Menu>
  );
}

function Menu({ children }: PropsWithChildren) {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-lg bg-slate-100 dark:bg-slate-900 md:relative md:left-auto md:transform-none">
      <div className="flex items-center gap-2 p-1.5">{children}</div>
    </div>
  );
}

function MenuGroup({ children }: PropsWithChildren) {
  return <div className="flex items-center gap-1">{children}</div>;
}

function MenuSeprator() {
  return <Separator orientation="vertical" className="h-8" />;
}
