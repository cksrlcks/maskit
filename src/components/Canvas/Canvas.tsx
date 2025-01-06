import Konva from "konva";
import { Stage, Layer, Rect, Transformer } from "react-konva";
import { useCanvas } from "@/context/CanvasContext";

export function Canvas() {
  const {
    isHide,
    stageRef,
    containerRef,
    transformerRef,
    imageUrl,
    canvasSize,
    rectangles,
    newRectangle,
    selectedId,
    color,
    opacity,
    isOCRMode,
    blocks,
    handleSelected,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleUpdateRect,
  } = useCanvas();

  const rects = [...rectangles, ...(newRectangle ? [newRectangle] : [])];

  if (!imageUrl) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center"
      ref={containerRef}
    >
      <div className="rounded-xl border border-slate-200 p-2 md:p-4">
        <div className="relative" style={{ width: canvasSize.width, height: canvasSize.height }}>
          <img
            src={imageUrl}
            alt="background"
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ width: canvasSize.width, height: canvasSize.height }}
          />

          <Stage
            ref={stageRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 bg-transparent"
            onPointerDown={handleMouseDown}
            onPointerMove={handleMouseMove}
            onPointerUp={handleMouseUp}
          >
            <Layer>
              {rects.map((rect, i) => (
                <Rect
                  key={i}
                  {...rect}
                  x={(rect.x || 0) * canvasSize.scale.x}
                  y={(rect.y || 0) * canvasSize.scale.y}
                  width={(rect.width || 0) * canvasSize.scale.x}
                  height={(rect.height || 0) * canvasSize.scale.y}
                  id={rect.id}
                  stroke={selectedId === rect.id ? "#00ff00" : undefined}
                  strokeWidth={2}
                  strokeScaleEnabled={false}
                  fill={color}
                  opacity={!isHide ? 0 : opacity}
                  onPointerDown={() => {
                    if (isHide) {
                      handleSelected(rect.id || null);
                    }
                  }}
                  onPointerUp={(e) => {
                    const node = e.target;
                    const scaleX = canvasSize.scale.x;
                    const scaleY = canvasSize.scale.y;
                    const updatedRect = {
                      ...rect,
                      x: node.x() / scaleX,
                      y: node.y() / scaleY,
                    };
                    handleUpdateRect(updatedRect);
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    const scaleX = canvasSize.scale.x;
                    const scaleY = canvasSize.scale.y;
                    const updatedRect = {
                      ...rect,
                      x: node.x() / scaleX,
                      y: node.y() / scaleY,
                    };
                    handleUpdateRect(updatedRect);
                  }}
                  onDragMove={() => {}} // draggable 경고 안보기위해서
                  draggable={isHide}
                />
              ))}

              {isOCRMode &&
                blocks.map((rect, i) => (
                  <Rect
                    key={i}
                    {...rect}
                    x={(rect.x || 0) * canvasSize.scale.x}
                    y={(rect.y || 0) * canvasSize.scale.y}
                    width={(rect.width || 0) * canvasSize.scale.x}
                    height={(rect.height || 0) * canvasSize.scale.y}
                    id={rect.id}
                    stroke={selectedId === rect.id ? "#00ff00" : undefined}
                    strokeWidth={2}
                    fill={color}
                    opacity={!isHide ? 0 : opacity}
                    onPointerDown={() => {
                      if (isHide) {
                        handleSelected(rect.id || null);
                      }
                    }}
                    onPointerUp={(e) => {
                      const node = e.target;
                      const scaleX = canvasSize.scale.x;
                      const scaleY = canvasSize.scale.y;
                      const updatedRect = {
                        ...rect,
                        fill: color,
                        x: node.x() / scaleX,
                        y: node.y() / scaleY,
                      };
                      handleUpdateRect(updatedRect);
                    }}
                    onTransformEnd={(e) => {
                      const node = e.target;
                      const scaleX = canvasSize.scale.x;
                      const scaleY = canvasSize.scale.y;
                      const updatedRect = {
                        ...rect,
                        fill: color,
                        x: node.x() / scaleX,
                        y: node.y() / scaleY,
                      };
                      handleUpdateRect(updatedRect);
                    }}
                    draggable={isHide}
                  />
                ))}
              {selectedId && isHide && (
                <>
                  <Transformer
                    ref={transformerRef}
                    nodes={[stageRef.current?.findOne(`#${selectedId}`) as Konva.Rect]}
                    keepRatio={false}
                    padding={6}
                    ignoreStroke={true}
                    boundBoxFunc={(_, newBox) => {
                      newBox.width = Math.max(5, newBox.width);
                      newBox.height = Math.max(5, newBox.height);
                      return newBox;
                    }}
                  />
                </>
              )}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}
