import Konva from "konva";
import { useEffect, useState, useRef } from "react";
import { Stage, Layer, Rect, Transformer } from "react-konva";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  Slider,
} from "@/components/ui";
import { RectConfig } from "konva/lib/shapes/Rect";
import { KonvaEventObject } from "konva/lib/Node";
import { useCanvas } from "@/context/CanvasContext";
import { Droplet, Redo, RotateCcw, Undo, WandSparkles, ImageUp } from "lucide-react";
import { HexColorPicker } from "react-colorful";

export interface Rect extends RectConfig {
  fill: string;
}

type History = {
  rectangles: Rect[];
  color: string;
  opacity: number;
};

function calculateCanvasSize(
  imageWidth: number,
  imageHeight: number,
  limitWidth: number,
  limitHeight: number,
) {
  const ratio = imageWidth / imageHeight;
  let targetWidth = imageWidth;
  let targetHeight = imageHeight;

  if (targetWidth > limitWidth) {
    targetWidth = limitWidth;
    targetHeight = targetWidth / ratio;
  }

  if (targetHeight > limitHeight) {
    targetHeight = limitHeight;
    targetWidth = targetHeight * ratio;
  }

  const scaleX = targetWidth / imageWidth;
  const scaleY = targetHeight / imageHeight;

  return {
    width: Math.round(targetWidth),
    height: Math.round(targetHeight),
    scale: {
      x: scaleX,
      y: scaleY,
    },
  };
}

export function Canvas() {
  const { stageRef, image, imageUrl, handleUpload } = useCanvas();

  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [canvasLimitSize, setCanvasLimitSize] = useState({
    maxWidth: 0,
    maxHeight: 0,
  });

  const [rectangles, setRectangles] = useState<Rect[]>([]);
  const [newRectangle, setNewRectangle] = useState<Rect | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [color, setColor] = useState("#000");
  const [opacity, setOpacity] = useState(1);

  const [history, setHistory] = useState<History[]>([
    {
      rectangles: [],
      color: "#000",
      opacity: 1,
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const isDrawing = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);

  useEffect(() => {
    function handleCanvasLimitSize() {
      const browserWidth = window.innerWidth;
      const browserHeight = window.innerHeight;

      setCanvasLimitSize({
        maxWidth: Math.round(browserWidth * 0.8),
        maxHeight: Math.min(Math.round(browserHeight * 0.8), browserHeight - 200),
      });
    }

    handleCanvasLimitSize();

    window.addEventListener("resize", handleCanvasLimitSize);

    return () => {
      window.removeEventListener("resize", handleCanvasLimitSize);
    };
  }, []);

  useEffect(() => {
    if (!image) return;

    const { width, height } = calculateCanvasSize(
      image.width,
      image.height,
      canvasLimitSize.maxWidth,
      canvasLimitSize.maxHeight,
    );

    if (width === canvasSize.width && height === canvasSize.height) return;

    const scaleX = width / canvasSize.width;
    const scaleY = height / canvasSize.height;

    setCanvasSize({ width, height });

    if (scaleX !== 1 || scaleY !== 1) {
      setRectangles((prev) =>
        prev.map((rect) => ({
          ...rect,
          x: (rect.x || 0) * scaleX,
          y: (rect.y || 0) * scaleY,
          width: (rect.width || 0) * scaleX,
          height: (rect.height || 0) * scaleY,
        })),
      );
    }
  }, [image, canvasSize, canvasLimitSize]);

  function handleMouseDown(e: KonvaEventObject<MouseEvent>) {
    const stage = e.target.getStage();
    const position = stage?.getPointerPosition();
    if (e.target !== e.target.getStage()) return;
    if (!position) return;

    setSelectedId(null);
    isDrawing.current = true;

    const { x, y } = position;
    setNewRectangle({
      x,
      y,
      width: 0,
      height: 0,
      fill: color,
      opacity,
    });
  }

  function handleMouseMove(e: KonvaEventObject<MouseEvent>) {
    if (!newRectangle) return;

    const stage = e.target.getStage();
    const position = stage?.getPointerPosition();

    if (!position || !stage) return;

    const { x, y } = position;

    const prevX = newRectangle.x || 0;
    const prevY = newRectangle.y || 0;

    const width = x - prevX;
    const height = y - prevY;

    setNewRectangle((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        width: width,
        height: height,
        x: prevX,
        y: prevY,
      };
    });
  }

  function handleMouseUp() {
    if (!newRectangle) return;

    isDrawing.current = false;

    const { width, height } = newRectangle;
    if (Math.abs(width || 0) > 5 && Math.abs(height || 0) > 5) {
      setRectangles((prev) => {
        const updatedRectangles = [...prev, newRectangle];
        addToHistory(updatedRectangles, color, opacity);
        return updatedRectangles;
      });
    }
    setNewRectangle(null);
  }

  function handleRectChange(index: number, newProps: Rect) {
    setRectangles((prev) => prev.map((rect, idx) => (idx === index ? newProps : rect)));
  }

  function handleColor(newColor: string) {
    setColor(newColor);
    addToHistory(rectangles, newColor, opacity);
  }

  function handleOpacity(newOpacity: number) {
    setOpacity(newOpacity);
    addToHistory(rectangles, color, newOpacity);
  }

  function handleReset() {
    setRectangles([]);
    setHistory([
      {
        rectangles: [],
        color: "#000",
        opacity: 1,
      },
    ]);
    setHistoryIndex(0);
  }

  function handleUndo() {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousState = history[newIndex];

      setHistoryIndex(newIndex);
      setRectangles(previousState.rectangles);
      setColor(previousState.color);
      setOpacity(previousState.opacity);
    }
  }
  function handleRedo() {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];

      setHistoryIndex(newIndex);
      setRectangles(nextState.rectangles);
      setColor(nextState.color);
      setOpacity(nextState.opacity);
    }
  }

  function addToHistory(newRectangles: Rect[], newColor: string, newOpacity: number) {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      rectangles: newRectangles,
      color: newColor,
      opacity: newOpacity,
    });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }

  const rects = [...rectangles, ...(newRectangle ? [newRectangle] : [])];
  const isDrawingMode = image;

  const disabledUndo = historyIndex <= 0;
  const disabledRedo = historyIndex >= history.length - 1;

  return (
    <>
      {isDrawingMode && (
        <div className="fixed bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-slate-100 dark:bg-slate-900">
          <div className="flex items-center gap-2 p-1.5">
            <div className="flex items-center gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" title="zinc">
                    <span
                      className="h-[1.2rem] w-[1.2rem] rounded-sm"
                      style={{ background: color }}
                    ></span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full">
                  <div className="mb-2">
                    <HexColorPicker
                      color={color}
                      onChange={handleColor}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="h-8 w-8 rounded-md border border-zinc-200"
                      onClick={() => handleColor("#fff")}
                      style={{ background: "#fff" }}
                    >
                      <span className="sr-only"></span>
                    </button>
                    <button
                      type="button"
                      className="h-8 w-8 rounded-md"
                      onClick={() => handleColor("#000")}
                      style={{ background: "#000" }}
                    >
                      <span className="sr-only"></span>
                    </button>
                    <button
                      type="button"
                      className="h-8 w-8 rounded-md"
                      onClick={() => handleColor("#ef4444")}
                      style={{ background: "#ef4444" }}
                    >
                      <span className="sr-only"></span>
                    </button>
                    <button
                      type="button"
                      className="h-8 w-8 rounded-md"
                      onClick={() => handleColor("#fbbf24")}
                      style={{ background: "#fbbf24" }}
                    >
                      <span className="sr-only"></span>
                    </button>
                    <button
                      type="button"
                      className="h-8 w-8 rounded-md border"
                      onClick={() => handleColor("#4ade80")}
                      style={{ background: "#4ade80" }}
                    >
                      <span className="sr-only"></span>
                    </button>
                    <button
                      type="button"
                      className="h-8 w-8 rounded-md border"
                      onClick={() => handleColor("#60a5fa")}
                      style={{ background: "#60a5fa" }}
                    >
                      <span className="sr-only"></span>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Droplet className="h-[1.2rem] w-[1.2rem]" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-36">
                  <Slider
                    defaultValue={[1]}
                    onValueChange={([opacity]) => handleOpacity(opacity)}
                    max={1}
                    step={0.1}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Separator orientation="vertical" className="h-8" />
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                title="이전 단계"
                onClick={handleUndo}
                disabled={disabledUndo}
              >
                <Undo className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">이전 단계</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                title="앞 단계"
                onClick={handleRedo}
                disabled={disabledRedo}
              >
                <Redo className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">앞 단계</span>
              </Button>
              <Button variant="outline" size="icon" title="리셋" onClick={handleReset}>
                <RotateCcw className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">리셋</span>
              </Button>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" title="자동 그리기">
                <WandSparkles className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">자동 그리기</span>
              </Button>
            </div>
          </div>
        </div>
      )}

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
                      draggable
                      id={`rect-${i}`}
                      stroke={selectedId === String(i) ? "#00ff00" : undefined}
                      strokeWidth={2}
                      fill={color}
                      opacity={opacity}
                      perfectDrawEnabled={false}
                      transformsEnabled="position"
                      onClick={() => setSelectedId(String(i))}
                      onDragEnd={(e) => {
                        handleRectChange(i, {
                          ...rect,
                          x: e.target.x(),
                          y: e.target.y(),
                        });
                      }}
                      onTransformEnd={(e) => {
                        const node = e.target;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();

                        // 크기 업데이트 후 scale 초기화
                        node.scaleX(1);
                        node.scaleY(1);

                        handleRectChange(i, {
                          ...rect,
                          x: node.x(),
                          y: node.y(),
                          width: node.width() * scaleX,
                          height: node.height() * scaleY,
                        });
                      }}
                    />
                  ))}
                  {selectedId !== null && (
                    <Transformer
                      ref={transformerRef}
                      nodes={[stageRef.current?.findOne(`#rect-${selectedId}`) as Konva.Rect]}
                      boundBoxFunc={(_, newBox) => {
                        newBox.width = Math.max(5, newBox.width);
                        newBox.height = Math.max(5, newBox.height);
                        return newBox;
                      }}
                    />
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
