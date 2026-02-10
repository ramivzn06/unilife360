import { cn } from "@/lib/utils/cn";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  module?: "finance" | "studies" | "social" | "sport";
}

const moduleColors = {
  finance: "bg-[var(--color-finance)]",
  studies: "bg-[var(--color-studies)]",
  social: "bg-[var(--color-social)]",
  sport: "bg-[var(--color-sport)]",
};

export function StatCard({
  label,
  value,
  trend,
  trendUp,
  icon: Icon,
  module = "finance",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "border-2 border-[var(--border)] rounded-xl shadow-[var(--shadow-brutalist)] p-5",
        moduleColors[module]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold opacity-70">{label}</p>
          <p className="text-3xl font-extrabold mt-1 tracking-tight">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-xs font-bold mt-2",
                trendUp ? "text-green-800" : "text-red-800"
              )}
            >
              {trendUp ? "+" : ""}
              {trend}
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-[var(--card)]/50 border-2 border-[var(--border)] flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
