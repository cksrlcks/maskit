import Konva from "konva";
import { Stage, Layer, Rect, Transformer } from "react-konva";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { useCanvas } from "@/context/CanvasContext";
import { ImageUp } from "lucide-react";

export function Canvas() {
  const {
    stageRef,
    containerRef,
    fileRef,
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
    handleUpload,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
  } = useCanvas();

  const rects = [...rectangles, ...(newRectangle ? [newRectangle] : [])];

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center"
        ref={containerRef}
      >
        {!imageUrl ? (
          <Card className="w-full max-w-xs p-4 text-center">
            <CardHeader>
              <ImageUp className="mx-auto mb-5 mt-3 h-12 w-12" />
              <CardTitle>편집할 이미지를 선택해주세요</CardTitle>
              <CardDescription>
                이미지는 서버에 업로드 되지 않습니다. <br />
                안심하고 사용하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleUpload}
              />
              <Button onClick={() => fileRef.current?.click()}>이미지 올리기</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-xl border border-slate-200 p-2 md:p-4">
            <div
              className="relative"
              style={{ width: canvasSize.width, height: canvasSize.height }}
            >
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
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
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
                      fill={color}
                      opacity={opacity}
                      onClick={() => handleSelected(rect.id || null)}
                      draggable
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
                        opacity={opacity}
                        onClick={() => handleSelected(rect.id || null)}
                        onDragMove={() => handleSelected(rect.id || null)}
                        draggable
                      />
                    ))}
                  {selectedId && (
                    <>
                      <Transformer
                        ref={transformerRef}
                        nodes={[stageRef.current?.findOne(`#${selectedId}`) as Konva.Rect]}
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
        )}
      </div>
    </>
  );
}
