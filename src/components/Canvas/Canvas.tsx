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
import { Droplet, RotateCcw, WandSparkles, ImageUp, Loader2, Trash2 } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { createWorker, PSM } from "tesseract.js";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

export interface Rect extends RectConfig {
  fill: string;
}

function calculateCanvasSize({
  width: imageWidth,
  height: imageHeight,
}: {
  width: number;
  height: number;
}) {
  const ratio = imageWidth / imageHeight;
  const browserWidth = window.innerWidth;
  const browserHeight = window.innerHeight;

  let targetWidth = imageWidth;
  let targetHeight = imageHeight;

  const limitWidth = Math.round(browserWidth * 0.8);
  const limitHeight = Math.min(Math.round(browserHeight * 0.8), browserHeight - 200);

  if (ratio > 1) {
    if (targetWidth > limitWidth) {
      targetWidth = limitWidth;
      targetHeight = targetWidth / ratio;
    }

    if (targetHeight > limitHeight) {
      targetHeight = limitHeight;
      targetWidth = targetHeight * ratio;
    }
  } else {
    if (targetHeight > limitHeight) {
      targetHeight = limitHeight;
      targetWidth = targetHeight * ratio;
    }

    if (targetWidth > limitWidth) {
      targetWidth = limitWidth;
      targetHeight = targetWidth / ratio;
    }
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

  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0, scale: { x: 1, y: 1 } });
  const [rectangles, setRectangles] = useState<Rect[]>([]);
  const [newRectangle, setNewRectangle] = useState<Rect | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [color, setColor] = useState("#000");
  const [opacity, setOpacity] = useState(1);
  const [isOCRLoading, setIsOCRLoading] = useState(true);
  const [isOCRMode, setIsOCRMode] = useState(false);

  const [blocks, setBlocks] = useState<Partial<Rect>[]>([]);

  const isDrawing = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);

  useEffect(() => {
    function handleCanvasLimitSize() {
      if (!image) return;
      const canvasSize = calculateCanvasSize(image);
      setCanvasSize(canvasSize);
    }

    handleCanvasLimitSize();

    window.addEventListener("resize", handleCanvasLimitSize);

    return () => {
      window.removeEventListener("resize", handleCanvasLimitSize);
    };
  }, [image]);

  useEffect(() => {
    if (!image || blocks.length) return;

    (async function getOCRData() {
      try {
        const worker = await createWorker(["kor", "eng"]);
        await worker.setParameters({
          tessedit_pageseg_mode: PSM.AUTO,
        });

        const { data } = await worker.recognize(image);
        const blocks = data.paragraphs.map((item) => ({
          x: item.bbox.x0,
          y: item.bbox.y0,
          width: item.bbox.x1 - item.bbox.x0,
          height: item.bbox.y1 - item.bbox.y0,
          id: `rect-${uuidv4()}`,
        }));

        setBlocks(blocks.slice(0, -1));

        await worker.terminate();
      } catch (error) {
        console.error(error);

        toast({
          duration: 2000,
          variant: "destructive",
          title: "자동감지 실패",
          description: "문자인식을 실패했습니다.",
        });
      } finally {
        setIsOCRLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  function handleMouseDown(e: KonvaEventObject<MouseEvent>) {
    const stage = e.target.getStage();
    const position = stage?.getPointerPosition();
    if (e.target !== e.target.getStage()) return;
    if (!position) return;

    setSelectedId(null);
    isDrawing.current = true;

    const x = position.x / canvasSize.scale.x;
    const y = position.y / canvasSize.scale.y;

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

    const x = position.x / canvasSize.scale.x;
    const y = position.y / canvasSize.scale.y;

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
        return [...prev, { ...newRectangle, id: `rect-${uuidv4()}` }];
      });
    }
    setNewRectangle(null);
  }

  function handleColor(color: string) {
    setColor(color);
  }

  function handleOpacity(opactiy: number) {
    setOpacity(opactiy);
  }

  function handleReset() {
    setRectangles([]);
    setOpacity(1);
    setColor("#000");
    setIsOCRMode(false);
  }

  function handleOCRMode() {
    if (blocks.length === 0) {
      toast({
        duration: 2000,
        variant: "destructive",
        title: "감지된 영역 없음",
        description: "문자인식이 잘 안되요.",
      });
    }
    setIsOCRMode((prev) => !prev);
  }

  function handleRefresh() {
    window.location.reload();
  }

  const rects = [...rectangles, ...(newRectangle ? [newRectangle] : [])];

  const isDrawingMode = image;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Backspace" || e.key === "Delete") && selectedId) {
        setBlocks(blocks.filter((block) => block.id !== selectedId));
        setRectangles(rectangles.filter((rect) => rect.id !== selectedId));
        setSelectedId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedId, blocks, rectangles]);

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
              <Button variant="outline" size="icon" title="리셋" onClick={handleRefresh}>
                <Trash2 className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">취소</span>
              </Button>
              <Button variant="outline" size="icon" title="리셋" onClick={handleReset}>
                <RotateCcw className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">리셋</span>
              </Button>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                title="자동 그리기"
                onClick={handleOCRMode}
                disabled={isOCRLoading}
              >
                {isOCRLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <WandSparkles className="h-[1.2rem] w-[1.2rem]" />
                )}

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
                      x={(rect.x || 0) * canvasSize.scale.x}
                      y={(rect.y || 0) * canvasSize.scale.y}
                      width={(rect.width || 0) * canvasSize.scale.x}
                      height={(rect.height || 0) * canvasSize.scale.y}
                      id={rect.id}
                      stroke={selectedId === rect.id ? "#00ff00" : undefined}
                      strokeWidth={2}
                      fill={color}
                      opacity={opacity}
                      onClick={() => setSelectedId(rect.id || null)}
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
                        onClick={() => setSelectedId(rect.id || null)}
                        onDragMove={() => setSelectedId(rect.id || null)}
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
