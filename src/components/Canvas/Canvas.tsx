import { Stage, Layer } from "react-konva";
import { RectItem } from "./RectItem";
import { EmojiItem } from "./EmojItem";
import { LoadingSpinner } from "./LoadingSpinner";
import { isMobile } from "react-device-detect";
import { useCanvasActions } from "@/hooks/useCanvasActions";
import { useAtom, useAtomValue } from "jotai";
import { imageAtom } from "@/atoms/image";
import { canvasAtom } from "@/atoms/canvas";
import { useEffect, useRef } from "react";

export function Canvas() {
  const image = useAtomValue(imageAtom);

  const [canvas, setCanvas] = useAtom(canvasAtom);
  const { isLoading, newRectangle, width, height, scale, isOCRMode, blocks, items } = canvas;
  const { handleMouseMove, handleMouseDown, handleMouseUp } = useCanvasActions();
  const allItems = [...items, ...(newRectangle ? [newRectangle] : [])];
  const stageRef = useRef(null);

  useEffect(() => {
    setCanvas((prev) => ({ ...prev, stage: stageRef.current }));
  }, [setCanvas]);

  if (!image.url) return null;

  return (
    <>
      {isLoading && isMobile && <LoadingSpinner />}
      <div className="md:safe-center fixed bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center p-14 scrollbar-hide md:overflow-auto">
        <div className="rounded-xl border border-slate-200 p-2 md:p-4">
          <div className="relative" style={{ width: width * scale.x, height: height * scale.y }}>
            <img
              src={image.url}
              alt="background"
              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ width: width * scale.x, height: height * scale.y }}
            />

            <Stage
              pixelRatio={1}
              ref={stageRef}
              width={width * scale.x}
              height={height * scale.y}
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
