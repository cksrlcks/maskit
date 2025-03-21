import { useCanvasActions } from "@/actions/canvas";
import { canvasAtom } from "@/atoms/canvas";
import { EMOJI_FONT_FAMILY, RECT_MIN_HEIGHT, RECT_MIN_WIDTH } from "@/constants/common";
import { RectItem } from "@/types/canvas";
import { useAtomValue } from "jotai";
import Konva from "konva";
import { useEffect, useRef } from "react";
import { isSafari } from "react-device-detect";
import { Text, Transformer } from "react-konva";

export function EmojiItem({ item }: { item: RectItem }) {
  const { opacity, isMaskMode, selectedId } = useAtomValue(canvasAtom);
  const { handleUpdateItems, handleSelected } = useCanvasActions();
  const textRef = useRef<Konva.Text | null>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const isSelected = selectedId === item.id;

  useEffect(() => {
    if (isSelected && transformerRef.current && textRef.current) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Text
        {...item}
        ref={textRef}
        {...(!isSafari && { fontFamily: EMOJI_FONT_FAMILY })}
        onPointerDown={() => {
          if (isMaskMode) {
            handleSelected(item.id || null);
          }
        }}
        opacity={!isMaskMode ? 0 : opacity}
        onDragEnd={(e) => {
          const node = e.target;
          const updated = {
            ...item,
            x: node.x(),
            y: node.y(),
          };
          handleUpdateItems(updated);
        }}
        draggable={isMaskMode}
      />
      {isSelected && isMaskMode && (
        <Transformer
          ref={transformerRef}
          keepRatio={true}
          padding={6}
          ignoreStroke={true}
          boundBoxFunc={(_, newBox) => {
            newBox.width = Math.max(RECT_MIN_WIDTH, newBox.width);
            newBox.height = Math.max(RECT_MIN_HEIGHT, newBox.height);
            return newBox;
          }}
        />
      )}
    </>
  );
}
