import { useCanvas } from "@/context/CanvasContext";
import { Color, Emoji, Image, Opacity, Stamp, Reset, Eye, Delete, Ocr } from "../Tools";
import { Menu } from "@/components/Menu";

export function CanvasMenu() {
  const { image } = useCanvas();

  if (!image) {
    return null;
  }

  return (
    <Menu>
      <Menu.Group>
        <Color />
        <Opacity />
        <Stamp />
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
