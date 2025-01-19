import { useState } from "react";
import { Button } from "../ui";
import { ArrowLeft, ArrowRight } from "lucide-react";
import feature1 from "@/assets/img/feature-1.svg";
import feature2 from "@/assets/img/feature-2.svg";
import feature3 from "@/assets/img/feature-3.svg";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const featureImage = [
  {
    id: 1,
    image: feature1,
  },
  {
    id: 2,
    image: feature2,
  },
  {
    id: 3,
    image: feature3,
  },
];

export function Feature({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [stage, setStage] = useState(0);
  const contents = Object.values(t("welcome.contents", { returnObjects: true }));
  const feature = featureImage.map((item, index) => ({ ...item, ...contents[index] }));
  const { title, desc } = feature[stage];

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
            <p className="min-h-16 text-sm text-muted-foreground">{desc}</p>
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
