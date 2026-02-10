import * as React from "react";
import { cn } from "@/lib/utils/cn";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full",
        "border-2 border-[var(--border)] rounded-xl",
        "bg-[var(--card)] px-4 py-3",
        "text-sm font-medium",
        "placeholder:text-[var(--muted-foreground)]",
        "focus:outline-none focus:shadow-[var(--shadow-brutalist-sm)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-shadow duration-150 resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
