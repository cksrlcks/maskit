import { useCanvas } from "@/context/CanvasContext";
import Konva from "konva";
import { RectConfig } from "konva/lib/shapes/Rect";
import { useEffect, useRef } from "react";
import { Rect, Transformer } from "react-konva";

export function RectItem({ item }: { item: RectConfig }) {
  const { color, opacity, isMaskMode, selectedId, handleUpdateItems, handleSelected } = useCanvas();
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
