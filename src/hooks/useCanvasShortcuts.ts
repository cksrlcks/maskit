import { dialogAtom } from "@/atoms/dialog";
import { useCanvasActions } from "@/hooks/useCanvasActions";
import { useSetAtom } from "jotai";
import { useHotkeys } from "react-hotkeys-hook";
import { useImageActions } from "./useImageActions";

export default function useCanvasShortcuts() {
  const { handlePaste } = useImageActions();
  const { handleImage, handleSelectDelete } = useCanvasActions();
  const setDialog = useSetAtom(dialogAtom);

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

  useHotkeys("shift+!, !", (e) => {
    e.preventDefault();
    setDialog("feature");
  });

  useHotkeys("/", (e) => {
    e.preventDefault();
    setDialog("guide");
  });

  useHotkeys("shift+?, ?, shfit+/", (e) => {
    e.preventDefault();
    setDialog("help");
  });

  useHotkeys("cmd+v, ctrl+v, meta+v", async (e) => {
    e.preventDefault();
    handlePaste();
  });

  return null;
}
