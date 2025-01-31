import { Color, Emoji, Image, Opacity, Reset, Eye, Delete, Ocr } from "../Tools";
import { Menu } from "@/components/Menu";
import { useAtomValue } from "jotai";
import { imageAtom } from "@/atoms/image";

export function CanvasMenu() {
  const image = useAtomValue(imageAtom);

  if (!image.element) {
    return null;
  }

  return (
    <Menu>
      <Menu.Group>
        <Color />
        <Opacity />
        {/* <Stamp /> */}
        <Emoji />
      </Menu.Group>
      <Menu.Seperator />
      <Menu.Group>
        <Image />
        <Reset />
        <Eye />
        <Delete />
      </Menu.Group>
      <Menu.Seperator />
      <Menu.Group>
        <Ocr />
      </Menu.Group>
    </Menu>
  );
}
