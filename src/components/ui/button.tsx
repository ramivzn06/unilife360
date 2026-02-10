import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "finance"
    | "studies"
    | "social"
    | "sport"
    | "outline"
    | "ghost"
    | "destructive";
  size?: "sm" | "default" | "lg" | "icon";
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-[var(--primary)] text-[var(--primary-foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[var(--shadow-brutalist-pressed)]",
  finance:
    "bg-[var(--color-finance)] text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[var(--shadow-brutalist-pressed)]",
  studies:
    "bg-[var(--color-studies)] text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[var(--shadow-brutalist-pressed)]",
  social:
    "bg-[var(--color-social)] text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[var(--shadow-brutalist-pressed)]",
  sport:
    "bg-[var(--color-sport)] text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[var(--shadow-brutalist-pressed)]",
  outline:
    "bg-[var(--card)] text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[var(--shadow-brutalist-pressed)]",
  ghost:
    "border-transparent shadow-none hover:bg-[var(--muted)] hover:translate-x-0 hover:translate-y-0",
  destructive:
    "bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[var(--shadow-brutalist-pressed)]",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3 text-sm",
  default: "h-11 px-5 text-sm",
  lg: "h-13 px-8 text-base",
  icon: "h-11 w-11",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold",
          "border-2 border-[var(--border)] rounded-xl",
          "shadow-[var(--shadow-brutalist)]",
          "transition-all duration-150 cursor-pointer",
          "active:translate-x-[4px] active:translate-y-[4px] active:shadow-[var(--shadow-brutalist-none)]",
          "disabled:pointer-events-none disabled:opacity-50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
