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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Accordion,
  AccordionTrigger,
  AccordionItem,
  AccordionContent,
} from "@/components/ui";
import { useCanvas } from "@/context/CanvasContext";
import { useState } from "react";

export function RootMenu() {
  const { image, handleImage } = useCanvas();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  return (
    <>
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
          <DropdownMenuItem onClick={() => setIsHelpOpen(true)}>
            <Info />
            궁금해요
            <DropdownMenuShortcut>?</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>궁금해요</DialogTitle>
            <DialogDescription>MASKIT의 기능에 대해 알려드립니다.</DialogDescription>
          </DialogHeader>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>이미지가 서버에 저장되나요?</AccordionTrigger>
              <AccordionContent>서버로 이미지파일을 전송하지 않습니다.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>사용에 제한이 있나요?</AccordionTrigger>
              <AccordionContent>마음껏 쓰셔도 됩니다.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </DialogContent>
      </Dialog>
    </>
  );
}
