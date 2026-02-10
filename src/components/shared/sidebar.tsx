"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wallet,
  Calendar,
  GraduationCap,
  Users,
  User,
  Dumbbell,
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "bg-[var(--color-finance)]",
    match: "/dashboard",
  },
  {
    label: "Finance",
    href: "/finance",
    icon: Wallet,
    color: "bg-[var(--color-finance)]",
    match: "/finance",
  },
  {
    label: "Emploi du temps",
    href: "/schedule",
    icon: Calendar,
    color: "bg-[var(--color-sport)]",
    match: "/schedule",
  },
  {
    label: "Études",
    href: "/academic",
    icon: GraduationCap,
    color: "bg-[var(--color-studies)]",
    match: "/academic",
  },
  {
    label: "Social",
    href: "/social",
    icon: Users,
    color: "bg-[var(--color-social)]",
    match: "/social",
  },
  {
    label: "Amis",
    href: "/friends",
    icon: Heart,
    color: "bg-[var(--color-social)]",
    match: "/friends",
  },
  {
    label: "Sport",
    href: "/sport",
    icon: Dumbbell,
    color: "bg-[var(--color-sport)]",
    match: "/sport",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen fixed left-0 top-0 z-40",
        "bg-[var(--background)] border-r-2 border-[var(--border)]",
        "transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[280px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-5 border-b-2 border-[var(--border)]">
        <div className="w-10 h-10 rounded-xl bg-[var(--primary)] border-2 border-[var(--border)] shadow-[var(--shadow-brutalist-sm)] flex items-center justify-center shrink-0">
          <span className="text-[var(--primary-foreground)] font-extrabold text-lg">U</span>
        </div>
        {!collapsed && (
          <span className="font-extrabold text-xl tracking-tight">
            UniLife 360
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.match);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl",
                "font-bold text-sm transition-all duration-150",
                "border-2",
                isActive
                  ? `${item.color} border-[var(--border)] shadow-[var(--shadow-brutalist-sm)]`
                  : "border-transparent hover:border-[var(--border)] hover:bg-[var(--muted)]"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t-2 border-[var(--border)] space-y-1">
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl",
            "font-bold text-sm transition-all duration-150",
            "border-2",
            pathname.startsWith("/profile")
              ? "bg-[var(--color-finance)] border-[var(--border)] shadow-[var(--shadow-brutalist-sm)]"
              : "border-transparent hover:border-[var(--border)] hover:bg-[var(--muted)]"
          )}
        >
          <User className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Profil</span>}
        </Link>

        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl",
            "font-bold text-sm transition-all duration-150",
            "border-2",
            pathname.startsWith("/settings")
              ? "bg-[var(--muted)] border-[var(--border)] shadow-[var(--shadow-brutalist-sm)]"
              : "border-transparent hover:border-[var(--border)] hover:bg-[var(--muted)]"
          )}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Paramètres</span>}
        </Link>

        <Link
          href="/settings/social"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl",
            "font-bold text-sm transition-all duration-150",
            "border-2",
            pathname === "/settings/social"
              ? "bg-[var(--color-social)] border-[var(--border)] shadow-[var(--shadow-brutalist-sm)]"
              : "border-transparent hover:border-[var(--border)] hover:bg-[var(--muted)]"
          )}
        >
          <MessageCircle className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Réseaux sociaux</span>}
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full
            font-bold text-sm text-[var(--muted-foreground)]
            hover:text-[var(--foreground)] transition-colors cursor-pointer"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Réduire</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
