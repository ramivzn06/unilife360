import * as React from "react";
import { cn } from "@/lib/utils/cn";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full",
        "border-2 border-[var(--border)] rounded-xl",
        "bg-[var(--card)] px-4 py-2",
        "text-sm font-medium",
        "placeholder:text-[var(--muted-foreground)]",
        "focus:outline-none focus:shadow-[var(--shadow-brutalist-sm)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-shadow duration-150",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
