import { Link, useRouteError } from "react-router-dom";
import { Button } from "../ui";

type Error = {
  status: number;
  statusText: string;
};

const ERROR_MESSAGE = {
  404: "페이지를 찾을 수 없습니다.",
  500: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
} as const;

export function Error() {
  const error = useRouteError() as Error;

  const message =
    ERROR_MESSAGE[error.status as keyof typeof ERROR_MESSAGE] || "알 수 없는 오류가 발생했습니다.";

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div>{message}</div>
      <Button asChild>
        <Link to="/">돌아가기</Link>
      </Button>
    </div>
  );
}
