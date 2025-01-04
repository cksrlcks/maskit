import { Share } from "lucide-react";
import { Button } from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useCanvas } from "@/context/CanvasContext";

export function ShareMenu() {
  const { image, handleImage } = useCanvas();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Share className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">공유하기</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleImage("copy")} disabled={!image}>
          이미지 복사하기
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleImage("download")} disabled={!image}>
          이미지 다운받기
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleImage("share")}>공유하기</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleImage("mail")}>메일 보내기</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
