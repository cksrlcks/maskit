import { Copy, Download, Mail, Share, Smartphone } from "lucide-react";
import { Button } from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useAtomValue } from "jotai";
import { imageAtom } from "@/atoms/image";
import { useCanvasActions } from "@/actions/canvas";

export function ShareMenu() {
  const image = useAtomValue(imageAtom);
  const { handleImage } = useCanvasActions();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Share className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">공유하기</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleImage("copy")} disabled={!image.element}>
          <Copy />
          이미지 복사하기
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleImage("download")} disabled={!image.element}>
          <Download />
          이미지 다운받기
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleImage("share")} disabled={!image.element}>
          <Smartphone />
          공유하기
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleImage("mail")} disabled={!image.element}>
          <Mail />
          메일 보내기
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
