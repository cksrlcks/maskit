import { PropsWithChildren } from "react";

export function AppLayer({ children }: PropsWithChildren) {
  return (
    <div className="pointer-events-none fixed left-0 top-0 z-10 h-dvh w-full">
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 top-4">{children}</div>
    </div>
  );
}
