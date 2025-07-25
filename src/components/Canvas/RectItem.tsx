import { useCanvasActions } from "@/hooks/useCanvasActions";
import { canvasAtom } from "@/atoms/canvas";
import { RECT_MIN_HEIGHT, RECT_MIN_WIDTH } from "@/constants/common";
import { RectItem as RectItemProps } from "@/types/canvas";
import { useAtomValue } from "jotai";
import Konva from "konva";
import { useEffect, useRef } from "react";
import { Rect, Transformer } from "react-konva";

export function RectItem({ item }: { item: RectItemProps }) {
  const { color, opacity, isMaskMode, selectedId } = useAtomValue(canvasAtom);
  const { handleUpdateItems, handleSelected } = useCanvasActions();
  const rectReft = useRef<Konva.Rect | null>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const isSelected = selectedId === item.id;

  useEffect(() => {
    if (isSelected && transformerRef.current && rectReft.current) {
      transformerRef.current.nodes([rectReft.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Rect
        {...item}
        ref={rectReft}
        stroke={selectedId === item.id ? "#00ff00" : undefined}
        strokeWidth={2}
        strokeScaleEnabled={false}
        fill={color}
        opacity={!isMaskMode ? 0 : opacity}
        onPointerDown={() => {
          if (isMaskMode) {
            handleSelected(item.id || null);
          }
        }}
        onDragEnd={(e) => {
          const node = e.target;
          const updated = {
            ...item,
            x: node.x(),
            y: node.y(),
          };
          handleUpdateItems(updated);
        }}
        keepRatio={item.type === "emoji"}
        draggable={isMaskMode}
      />
      {isSelected && isMaskMode && (
        <Transformer
          ref={transformerRef}
          keepRatio={false}
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
