import { cn } from "@/lib/utils/cn";

interface ModuleHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function ModuleHeader({
  title,
  description,
  children,
}: ModuleHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
      )}
    >
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-[var(--muted-foreground)] mt-1 text-sm font-medium">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
