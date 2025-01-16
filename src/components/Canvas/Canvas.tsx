import { Stage, Layer } from "react-konva";
import { useCanvas } from "@/context/CanvasContext";
import { RectItem } from "./RectItem";
import { EmojiItem } from "./EmojItem";
import { LoadingSpinner } from "./LoadingSpinner";
import { isMobile } from "react-device-detect";

export function Canvas() {
  const {
    isLoading,
    stageRef,
    containerRef,
    canvasSize,
    scale,
    newRectangle,
    isOCRMode,
    blocks,
    items,
    imageUrl,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
  } = useCanvas();

  const allItems = [...items, ...(newRectangle ? [newRectangle] : [])];

  if (!imageUrl) return null;

  return (
    <>
      {isLoading && isMobile && <LoadingSpinner />}
      <div
        className="md:safe-center fixed bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center p-14 scrollbar-hide md:overflow-auto"
        ref={containerRef}
      >
        <div className="rounded-xl border border-slate-200 p-2 md:p-4">
          <div
            className="relative"
            style={{ width: canvasSize.width * scale.x, height: canvasSize.height * scale.y }}
          >
            <img
              src={imageUrl}
              alt="background"
              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ width: canvasSize.width * scale.x, height: canvasSize.height * scale.y }}
            />

            <Stage
              pixelRatio={1}
              ref={stageRef}
              width={canvasSize.width * scale.x}
              height={canvasSize.height * scale.y}
              scaleX={scale.x}
              scaleY={scale.y}
              className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 bg-transparent"
              onPointerDown={handleMouseDown}
              onPointerMove={handleMouseMove}
              onPointerUp={handleMouseUp}
            >
              <Layer>
                {allItems.map((item) => {
                  if (item.type === "rect") {
                    return <RectItem key={item.id} item={item} />;
                  } else if (item.type === "emoji") {
                    return <EmojiItem key={item.id} item={item} />;
                  }
                })}

                {isOCRMode && blocks.map((item) => <RectItem key={item.id} item={item} />)}
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
    </>
  );
}
