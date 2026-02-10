"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Wallet, BookOpen, Users, Dumbbell, Settings } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { searchItems, type SearchItem } from "@/lib/constants/search-index";

const MODULE_ICONS: Record<string, React.ElementType> = {
  finance: Wallet,
  studies: BookOpen,
  social: Users,
  sport: Dumbbell,
  general: Settings,
};

const MODULE_COLORS: Record<string, string> = {
  finance: "var(--color-finance)",
  studies: "var(--color-studies)",
  social: "var(--color-social)",
  sport: "var(--color-sport)",
  general: "var(--primary)",
};

const CATEGORY_LABELS: Record<string, string> = {
  page: "Pages",
  feature: "Fonctionnalités",
  action: "Actions rapides",
};

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Search on query change
  useEffect(() => {
    if (query.length > 0) {
      setResults(searchItems(query));
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Navigate to result
  const navigateTo = useCallback(
    (item: SearchItem) => {
      onClose();
      router.push(item.href);
    },
    [onClose, router]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === "Enter" && results.length > 0) {
        e.preventDefault();
        navigateTo(results[selectedIndex]);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, results, selectedIndex, onClose, navigateTo]);

  if (!open) return null;

  // Group results by category
  const grouped = results.reduce<Record<string, SearchItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Flat index for keyboard navigation
  let flatIndex = -1;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-50 animate-in slide-in-from-top-4 fade-in duration-200">
        <div className="brutalist-card overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-[var(--border)]">
            <Search className="w-5 h-5 text-[var(--muted-foreground)] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une page, fonctionnalité..."
              className="flex-1 bg-transparent text-base font-medium placeholder:text-[var(--muted-foreground)] focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 rounded-lg hover:bg-[var(--muted)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-0.5 rounded border border-[var(--border)]">
              Esc
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[50vh] overflow-y-auto py-2">
            {query.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-[var(--muted-foreground)] font-medium">
                  Tape pour chercher...
                </p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  Ex: &quot;finance&quot;, &quot;loyer&quot;, &quot;sport&quot;, &quot;profil&quot;
                </p>
              </div>
            )}

            {query.length > 0 && results.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-[var(--muted-foreground)] font-medium">
                  Aucun résultat pour &quot;{query}&quot;
                </p>
              </div>
            )}

            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div className="px-4 py-1.5">
                  <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                    {CATEGORY_LABELS[category] || category}
                  </span>
                </div>
                {items.map((item) => {
                  flatIndex++;
                  const isSelected = flatIndex === selectedIndex;
                  const Icon = MODULE_ICONS[item.module] || Settings;
                  const color = MODULE_COLORS[item.module] || "var(--primary)";
                  const currentFlatIndex = flatIndex;

                  return (
                    <button
                      key={item.id}
                      onClick={() => navigateTo(item)}
                      onMouseEnter={() => setSelectedIndex(currentFlatIndex)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-left",
                        "transition-colors duration-100",
                        isSelected
                          ? "bg-[var(--muted)]"
                          : "hover:bg-[var(--muted)]/50"
                      )}
                    >
                      <div
                        className="w-8 h-8 rounded-lg border-2 border-[var(--border)] flex items-center justify-center shrink-0"
                        style={{ backgroundColor: color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{item.title}</p>
                        <p className="text-xs text-[var(--muted-foreground)] truncate">
                          {item.description}
                        </p>
                      </div>
                      {isSelected && (
                        <ArrowRight className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t-2 border-[var(--border)] flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1">
              <kbd className="bg-[var(--muted)] px-1.5 py-0.5 rounded border border-[var(--border)]">↑↓</kbd>
              naviguer
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-[var(--muted)] px-1.5 py-0.5 rounded border border-[var(--border)]">↵</kbd>
              ouvrir
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-[var(--muted)] px-1.5 py-0.5 rounded border border-[var(--border)]">Esc</kbd>
              fermer
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
