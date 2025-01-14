import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  label: string;
}

const badgeVariants = cva(
  "inline-flex py-1 px-2 items-center rounded-full text-xs font-semibold uppercase",

  {
    variants: {
      badgeColor: {
        slate: "bg-slate-200 text-slate-900",
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

export function Badge({ className, badgeColor, label }: BadgeProps) {
  return <div className={cn(badgeVariants({ badgeColor }), className)}>{label}</div>;
}
