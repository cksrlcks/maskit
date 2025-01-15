import { PropsWithChildren } from "react";
import { Separator as SeparatorBar } from "@/components/ui";

export function Menu({ children }: PropsWithChildren) {
  return (
    <div className="rounded-lg bg-slate-100 dark:bg-slate-900">
      <div className="flex items-center gap-2 p-1.5">{children}</div>
    </div>
  );
}

export function Group({ children }: PropsWithChildren) {
  return <div className="flex items-center gap-1">{children}</div>;
}

function Separator() {
  return <SeparatorBar orientation="vertical" className="h-8" />;
}

Menu.Group = Group;
Menu.Seperator = Separator;
