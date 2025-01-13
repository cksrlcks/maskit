import { ChangeEvent, HTMLAttributes } from "react";
import { useCanvas } from "@/context/CanvasContext";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import dropboxIcon from "@/assets/img/icon-dropbox.svg";
import googleIcon from "@/assets/img/icon-drive.svg";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";

export function Upload() {
  const { handleUpload } = useCanvas();
  const { getRootProps, getInputProps, open, isDragAccept, isDragReject } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/svg": [".svg"],
    },
    noClick: true,
    onDrop: (files) => handleUpload(files),
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-[500px] flex-col items-center justify-center">
        <div {...getRootProps({ className: "mb-4 w-full rounded-md bg-slate-100 p-2" })}>
          <div
            className={clsx(
              "pointer-events-none flex h-full w-full flex-col items-center justify-center rounded-md border border-dashed border-slate-300 p-16",
              isDragAccept && "border-slate-800",
              isDragReject && "border-rose-500",
            )}
          >
            <div className="my-4 text-center">
              <h2 className="mb-1 font-bold">편집할 이미지를 업로드해주세요</h2>
              <p className="text-sm text-muted-foreground">
                이 박스에 이미지를 드롭 하시거나, <br />
                클립보드에서 이미지를 붙여넣기 하실수 있어요
              </p>
              <input {...getInputProps()} hidden className="hidden" />
            </div>
            <div className="mb-8 flex items-stretch rounded-md text-white">
              <button
                className="pointer-events-auto rounded-l-md bg-slate-900 px-3 hover:bg-slate-800"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
              >
                이미지 업로드
              </button>
              <div className="pointer-events-auto h-10 w-10 rounded-r-md border-l border-slate-600 bg-slate-900 hover:bg-slate-800">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-full w-full items-center justify-center">
                      <ChevronDown className="h-5 w-5" />
                      <span className="sr-only">다른 옵션보기</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <img src={dropboxIcon} alt="dropdown" className="h-4 w-4" />
                      Dropdown
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <img src={googleIcon} alt="Google drive" className="h-4 w-4" />
                      Google drive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Badge label="jpg" badgeColor="blue" />
              <Badge label="png" badgeColor="rose" />
              <Badge label="svg" badgeColor="green" />
            </div>
          </div>
        </div>
        <div className="p-2 text-xs text-muted-foreground">
          이미지는 서버에 업로드 되지 않습니다. 안심하고 사용하세요.
        </div>
      </div>
    </div>
  );
}

const badgeVariants = cva(
  "inline-flex py-1 px-2 items-center rounded-full text-xs font-semibold uppercase",

  {
    variants: {
      badgeColor: {
        slate: "bg-slate-100 text-slate-900",
        rose: "bg-rose-100 text-rose-900",
        blue: "bg-blue-100 text-blue-900",
        green: "bg-green-100 text-green-900",
      },
    },
    defaultVariants: {
      badgeColor: "slate",
    },
  },
);

interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  label: string;
}

function Badge({ className, badgeColor, label }: BadgeProps) {
  return <div className={cn(badgeVariants({ badgeColor }), className)}>{label}</div>;
}

// <Card className="w-full max-w-96 p-4 text-center">
//   <CardHeader>
//     <ImageUp className="mx-auto mb-5 mt-3 h-12 w-12" />
//     <CardTitle>편집할 이미지를 선택해주세요</CardTitle>
//     <CardDescription>
//       이미지는 서버에 업로드 되지 않습니다. <br />
//       안심하고 사용하세요.
//     </CardDescription>
//   </CardHeader>
//   <CardContent className="text-center">
//     <input
//       ref={fileRef}
//       type="file"
//       accept="image/*"
//       className="sr-only"
//       onChange={handleUpload}
//     />
//     <Button onClick={() => fileRef.current?.click()}>이미지 올리기</Button>
//   </CardContent>
// </Card>;
