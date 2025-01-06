import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { useCanvas } from "@/context/CanvasContext";
import { ImageUp } from "lucide-react";

export function Upload() {
  const { fileRef, handleUpload } = useCanvas();

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center">
      <label className="cursor-pointer">
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
      </label>
    </div>
  );
}
