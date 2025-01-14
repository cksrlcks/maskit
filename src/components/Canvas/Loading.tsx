import { PropsWithChildren } from "react";

export function Loading({ children }: PropsWithChildren) {
  return (
    <div className="flex h-dvh w-full items-center justify-center font-normal text-muted-foreground">
      {children}
    </div>
  );
}
