"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wallet,
  Calendar,
  GraduationCap,
  Users,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard, color: "bg-[var(--color-finance)]" },
  { label: "Finance", href: "/finance", icon: Wallet, color: "bg-[var(--color-finance)]" },
  { label: "Études", href: "/academic", icon: GraduationCap, color: "bg-[var(--color-studies)]" },
  { label: "Amis", href: "/friends", icon: Users, color: "bg-[var(--color-social)]" },
  { label: "Planning", href: "/schedule", icon: Calendar, color: "bg-[var(--color-sport)]" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-50",
        "h-[80px] pb-[env(safe-area-inset-bottom)]",
        "bg-[var(--background)] border-t-2 border-[var(--border)]",
        "flex items-center justify-around px-1"
      )}
    >
      {TABS.map((tab) => {
        const isActive =
          tab.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-1 py-2 rounded-xl",
              "text-[10px] font-bold transition-all min-w-0",
              isActive
                ? "text-[var(--foreground)]"
                : "text-[var(--muted-foreground)]"
            )}
          >
            <div
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-xl",
                "transition-all duration-150",
                isActive &&
                `${tab.color} border-2 border-[var(--border)] shadow-[var(--shadow-brutalist-sm)]`
              )}
            >
              <tab.icon className="w-5 h-5" />
            </div>
            <span className="truncate">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
