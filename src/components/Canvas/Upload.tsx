import { useEffect } from "react";
import { ChevronDown, HardDrive } from "lucide-react";
import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import useGoogleDrive from "@/hooks/useGoogleDrive";
import useDropbox from "@/hooks/useDropbox";
import { Loading } from "./Loading";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "@/hooks/useToast";
import { getClipboardImage } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { imageAtom } from "@/atoms/image";
import { useImageActions } from "@/actions/image";

export function Upload() {
  const image = useAtomValue(imageAtom);
  const { handleUpload, handleUploadByBlob } = useImageActions();
  const { getRootProps, getInputProps, open, isDragAccept, isDragReject } = useDropzone({
    accept: {
      "image/png": [],
      "image/jpg": [],
      "image/jpeg": [],
      "image/svg+xml": [],
      "image/webp": [],
    },
    multiple: false,
    noClick: true,
    onDrop: (files) => handleUpload(files),
  });
  const {
    blob: googleDriveBlob,
    isLoading: googleDriveLoading,
    handleOpenPicker: handleGooglePicker,
  } = useGoogleDrive();
  const {
    blob: dropboxBlob,
    isLoading: dropboxLoading,
    handleOpenPicker: handleDropboxPicker,
  } = useDropbox();

  useEffect(() => {
    if (googleDriveBlob) {
      handleUploadByBlob(googleDriveBlob);
    }
  }, [googleDriveBlob, handleUploadByBlob]);

  useEffect(() => {
    if (dropboxBlob) {
      handleUploadByBlob(dropboxBlob);
    }
  }, [dropboxBlob, handleUploadByBlob]);

  useHotkeys("cmd+v, ctrl+v, meta+v", async (e) => {
    e.preventDefault();
    if (image.element || image.url) return;

    try {
      const blob = await getClipboardImage();

      if (blob) {
        handleUploadByBlob(blob);
      }
    } catch (error) {
      console.error(error);
      toast({
        duration: 2000,
        title: "붙여넣기에 실패했습니다.",
        description: "붙여넣을수 없는 형식입니다.",
      });
    }
  });

  if (googleDriveLoading) return <Loading>구글드라이브에서 데이터를 가져오고 있어요</Loading>;
  if (dropboxLoading) return <Loading>드롭박스에서 데이터를 가져오고 있어요</Loading>;

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-[500px] flex-col items-center justify-center">
        <div
          {...getRootProps({
            className: "mb-4 w-full rounded-md bg-slate-50 p-2 dark:bg-transparent",
          })}
        >
          <div
            className={clsx(
              "pointer-events-none flex h-full w-full flex-col items-center justify-center rounded-md border border-dashed border-slate-300 p-16 dark:border-slate-800",
              isDragAccept && "border-slate-800 dark:border-slate-400",
              isDragReject && "border-rose-500 dark:border-rose-300",
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
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        open();
                      }}
                    >
                      <HardDrive className="h-4 w-4" />
                      PC에서 가져오기
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDropboxPicker}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.2847 10.6683L22.5 13.9909L17.248 17.3368L12 13.9934L6.75198 17.3368L1.5 13.9909L6.7152 10.6684L1.5 7.34587L6.75206 4L11.9999 7.34335L17.2481 4L22.5 7.34587L17.2847 10.6683ZM17.2112 10.6684L11.9999 7.3484L6.78869 10.6683L12 13.9883L17.2112 10.6684ZM6.78574 18.4456L12.0377 15.1L17.2898 18.4456L12.0377 21.7916L6.78574 18.4456Z"></path>
                      </svg>
                      Dropbox
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleGooglePicker}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M7.94037 4.14596L11.4217 10.1759L5.48201 20.4688L2 14.44L7.94037 4.14596ZM10.1161 14.44H22L18.518 20.4688H6.63537L10.1161 14.44ZM14.4589 13.4399L8.51799 3.14502H15.482L21.4229 13.4399H14.4589Z"></path>
                      </svg>
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
              <Badge label="webp" badgeColor="slate" />
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
