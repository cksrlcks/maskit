import { useCanvas } from "@/context/CanvasContext";
import Konva from "konva";
import { TextConfig } from "konva/lib/shapes/Text";
import { useEffect, useRef } from "react";
import { Text, Transformer } from "react-konva";

export function EmojiItem({ item }: { item: TextConfig }) {
  const { opacity, isMaskMode, selectedId, handleUpdateItems, handleSelected } = useCanvas();
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
        fontFamily="Noto Color Emoji"
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
          keepRatio
          padding={6}
          ignoreStroke={true}
          boundBoxFunc={(_, newBox) => {
            newBox.width = Math.max(5, newBox.width);
            newBox.height = Math.max(5, newBox.height);
            return newBox;
          }}
        />
      )}
    </>
  );
}
