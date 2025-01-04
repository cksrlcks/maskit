import { Menu, Download, Copy, Share, Info, Mail, MessageCircle, Smartphone } from "lucide-react";
import {
  Button,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui";
import { useCanvas } from "@/context/CanvasContext";

export function RootMenu() {
  const { image, handleImage } = useCanvas();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">메뉴</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>메뉴</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleImage("download")} disabled={!image}>
          <Download />
          이미지 저장하기
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleImage("copy")} disabled={!image}>
          <Copy />
          이미지 복사하기
          <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Share />
            공유하기
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => handleImage("share")} disabled={!image}>
                <Smartphone />
                공유하기
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleImage("mail")} disabled={!image}>
                <Mail />
                이메일 보내기
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleImage("kakao")} disabled={!image}>
                <MessageCircle /> 카카오톡
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Info />
          궁금해요
          <DropdownMenuShortcut>?</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
