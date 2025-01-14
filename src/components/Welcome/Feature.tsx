import { useState } from "react";
import { Button } from "../ui";
import { ArrowLeft, ArrowRight } from "lucide-react";
import feature1 from "@/assets/img/feature-1.svg";
import feature2 from "@/assets/img/feature-2.svg";
import feature3 from "@/assets/img/feature-3.svg";
import clsx from "clsx";

const feature = [
  {
    id: 1,
    image: feature1,
    title: "무엇이든 마스킹하세요.",
    content:
      "마우스(터치)를 사용해서 영역을 마스킹하세요. 마스킹한 부분을 크기조정, 투명조절까지 가능합니다.",
  },
  {
    id: 2,
    image: feature2,
    title: "이모지를 사용해보세요.",
    content:
      "다양한 이모지를 활용하여 이미지를 꾸미거나 표현을 더 풍성하게 만들어보세요. 손쉽게 크기를 조절하고 배치할 수 있습니다.",
  },
  {
    id: 3,
    image: feature3,
    title: "텍스트를 자동으로 가려드려요",
    content:
      "이미지에서 텍스트 영역을 감지하여 자동으로 가려주는 기능을 제공합니다. 원클릭으로 쉽게 텍스트를 숨길 수 있습니다.",
  },
];

export function Feature({ onClose }: { onClose: () => void }) {
  const [stage, setStage] = useState(0);
  const { title, content } = feature[stage];

  return (
    <div className="p-6">
      <div className="max-w-[400px] overflow-hidden rounded-md bg-background dark:border">
        <figure className="relative aspect-[5/3] bg-slate-50">
          {feature.map((item) => (
            <img
              key={item.id}
              src={item.image}
              className={clsx(
                "pointer-events-none absolute left-0 top-0 h-full w-full transition-opacity",
                stage === item.id - 1 ? "opacity-1" : "opacity-0",
              )}
              alt={item.title}
            />
          ))}
        </figure>
        <div className="break-keep p-6">
          <div className="mb-6">
            <h2 className="mb-1 text-lg font-semibold">{title}</h2>
            <p className="min-h-16 text-sm text-muted-foreground">{content}</p>
          </div>
          <div className="flex flex-row-reverse items-center justify-between">
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setStage((prev) => (prev === 0 ? feature.length - 1 : prev - 1))}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Previous slide</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setStage((prev) => (prev === feature.length - 1 ? 0 : prev + 1))}
              >
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">Previous slide</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
