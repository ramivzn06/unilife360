"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Search, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { CommandPalette } from "./command-palette";

export function Topbar() {
  const [commandOpen, setCommandOpen] = useState(false);

  // Global Cmd+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header
        className={cn(
          "h-[64px] w-full",
          "bg-[var(--background)] border-b-2 border-[var(--border)]",
          "flex items-center justify-between px-5",
          "sticky top-0 z-30"
        )}
      >
        {/* Left: Mobile logo */}
        <div className="md:hidden flex items-center gap-2">
          <Link href="/finance" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] border-2 border-[var(--border)] shadow-[var(--shadow-brutalist-sm)] flex items-center justify-center">
              <span className="text-[var(--primary-foreground)] font-extrabold text-sm">U</span>
            </div>
            <span className="font-extrabold text-lg">UniLife</span>
          </Link>
        </div>

        {/* Center: Search trigger */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-auto">
          <button
            onClick={() => setCommandOpen(true)}
            className="relative w-full group"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <div
              className={cn(
                "w-full h-10 pl-10 pr-4 flex items-center",
                "border-2 border-[var(--border)] rounded-xl",
                "bg-[var(--card)] text-sm font-medium text-[var(--muted-foreground)]",
                "group-hover:shadow-[var(--shadow-brutalist-sm)]",
                "transition-shadow duration-150 cursor-pointer"
              )}
            >
              Rechercher... (Cmd+K)
            </div>
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-0.5 rounded border border-[var(--border)]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Mobile search button */}
        <button
          onClick={() => setCommandOpen(true)}
          className={cn(
            "md:hidden w-10 h-10 flex items-center justify-center rounded-xl",
            "border-2 border-[var(--border)]",
            "hover:bg-[var(--muted)] transition-colors cursor-pointer"
          )}
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/notifications"
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-xl",
              "border-2 border-[var(--border)]",
              "hover:bg-[var(--muted)] transition-colors cursor-pointer relative"
            )}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--destructive)] border-2 border-[var(--border)] rounded-full text-[8px] font-bold flex items-center justify-center">
              2
            </span>
          </Link>

          <Link
            href="/profile"
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-xl",
              "border-2 border-[var(--border)] bg-[var(--color-finance)]",
              "shadow-[var(--shadow-brutalist-sm)]",
              "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none",
              "transition-all duration-150 cursor-pointer"
            )}
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Command Palette */}
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </>
  );
}
