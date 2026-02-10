import { cn } from "@/lib/utils/cn";
import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center"
      )}
    >
      <div className="w-20 h-20 rounded-xl bg-[var(--muted)] border-2 border-[var(--border)] shadow-[var(--shadow-brutalist)] flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-[var(--muted-foreground)]" />
      </div>
      <h3 className="text-xl font-extrabold mb-2">{title}</h3>
      <p className="text-[var(--muted-foreground)] text-sm max-w-sm mb-6">
        {description}
      </p>
      {children}
    </div>
  );
}
