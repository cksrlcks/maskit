import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  Slider,
} from "@/components/ui";
import { useAlert } from "@/context/AlertContext";
import { useCanvas } from "@/context/CanvasContext";
import { Droplet, Eraser, Eye, EyeOff, Images, Loader2, Trash2, WandSparkles } from "lucide-react";
import { HexColorPicker } from "react-colorful";

export function CanvasMenu() {
  const {
    isHide,
    image,
    color,
    selectedId,
    handleColor,
    handleOpacity,
    handleReset,
    handleOCRMode,
    handleRefresh,
    handleToggleHide,
    handleSelectDelete,
    isOCRLoading,
  } = useCanvas();

  const { onAlert } = useAlert();

  if (!image) {
    return null;
  }

  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-lg bg-slate-100 dark:bg-slate-900 md:relative md:left-auto md:transform-none">
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
                <HexColorPicker color={color} onChange={handleColor} style={{ width: "100%" }} />
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
            title="이미지 교체"
            onClick={() =>
              onAlert({
                title: "이미지교체",
                message: "작업내용이 사라집니다. 정말 교체할까요?",
                onAction: handleRefresh,
              })
            }
          >
            <Images className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">이미지 교체</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            title="전부 지우기"
            onClick={() =>
              onAlert({
                title: "작업초기화",
                message: "작업내용을 모두 지웁니다.",
                onAction: handleReset,
              })
            }
          >
            <Eraser className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">전부 지우기</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            title={isHide ? "보이기" : "가리기"}
            onClick={handleToggleHide}
          >
            {isHide ? (
              <EyeOff className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Eye className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">{isHide ? "보이기" : "가리기"}</span>
          </Button>
          {selectedId && (
            <Button
              variant="outline"
              size="icon"
              title="선택삭제"
              data-prevent-focusout
              onClick={handleSelectDelete}
            >
              <Trash2 className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">선택삭제</span>
            </Button>
          )}
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
  );
}
