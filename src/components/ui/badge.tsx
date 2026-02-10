import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "finance"
    | "studies"
    | "social"
    | "sport"
    | "outline"
    | "destructive";
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-[var(--primary)] text-[var(--primary-foreground)]",
  finance: "bg-[var(--color-finance)] text-black",
  studies: "bg-[var(--color-studies)] text-black",
  social: "bg-[var(--color-social)] text-black",
  sport: "bg-[var(--color-sport)] text-black",
  outline: "bg-transparent text-[var(--foreground)]",
  destructive: "bg-[var(--destructive)] text-[var(--destructive-foreground)]",
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center",
        "border-2 border-[var(--border)] rounded-xl",
        "px-3 py-1",
        "text-xs font-bold",
        "shadow-[var(--shadow-brutalist-sm)]",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
