import * as React from "react";
import { cn } from "@/lib/utils/cn";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    module?: "finance" | "studies" | "social" | "sport";
    hover?: boolean;
  }
>(({ className, module, hover = false, ...props }, ref) => {
  const moduleColors = {
    finance: "bg-[var(--color-finance)]",
    studies: "bg-[var(--color-studies)]",
    social: "bg-[var(--color-social)]",
    sport: "bg-[var(--color-sport)]",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "border-2 border-[var(--border)] rounded-xl shadow-[var(--shadow-brutalist)] bg-[var(--card)] text-[var(--card-foreground)]",
        hover &&
          "transition-all duration-150 cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[var(--shadow-brutalist-pressed)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[var(--shadow-brutalist-none)]",
        module && moduleColors[module],
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 p-5", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-extrabold leading-tight tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[var(--muted-foreground)]", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-5 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
