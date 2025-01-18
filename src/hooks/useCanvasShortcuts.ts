import { useCanvasActions } from "@/actions/canvas";
import { useHotkeys } from "react-hotkeys-hook";

export default function useCanvasShortcuts() {
  const { handleImage, handleSelectDelete } = useCanvasActions();

  useHotkeys("cmd+s, ctrl+s, meta+s", (e) => {
    e.preventDefault();
    handleImage("download");
  });

  useHotkeys("cmd+c, ctrl+c, meta+c", (e) => {
    e.preventDefault();
    handleImage("copy");
  });

  useHotkeys("backspace, delete", (e) => {
    e.preventDefault();
    handleSelectDelete();
  });

  return null;
}
