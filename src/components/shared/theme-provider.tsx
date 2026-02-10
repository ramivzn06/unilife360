"use client";

import { useEffect, useState } from "react";

/* ── Color manipulation helpers ── */

function hexToHSL(hex: string): { h: number; s: number; l: number } {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function lightenColor(hex: string, amount: number): string {
    const { h, s, l } = hexToHSL(hex);
    return hslToHex(h, s, Math.min(90, l + amount));
}

function darkenColor(hex: string, amount: number): string {
    const { h, s, l } = hexToHSL(hex);
    return hslToHex(h, s, Math.max(10, l - amount));
}

/* ── Default accent colors (must match globals.css :root) ── */

const DEFAULT_ACCENTS: Record<string, string> = {
    accentFinance: "#86efac",
    accentStudies: "#d8b4fe",
    accentSocial: "#f9a8d4",
    accentSport: "#fdba74",
};

const ACCENT_TO_CSS: Record<string, [string, string, string]> = {
    accentFinance: ["--color-finance", "--color-finance-light", "--color-finance-dark"],
    accentStudies: ["--color-studies", "--color-studies-light", "--color-studies-dark"],
    accentSocial: ["--color-social", "--color-social-light", "--color-social-dark"],
    accentSport: ["--color-sport", "--color-sport-light", "--color-sport-dark"],
};

/* ── Apply accent colors to CSS custom properties ── */

function applyAccentColors(settings: Record<string, unknown>) {
    const root = document.documentElement;

    for (const [key, vars] of Object.entries(ACCENT_TO_CSS)) {
        const value = settings[key] as string | undefined;
        if (value && value !== DEFAULT_ACCENTS[key]) {
            root.style.setProperty(vars[0], value);
            root.style.setProperty(vars[1], lightenColor(value, 15));
            root.style.setProperty(vars[2], darkenColor(value, 15));
        } else {
            // Reset to let CSS cascade handle it
            root.style.removeProperty(vars[0]);
            root.style.removeProperty(vars[1]);
            root.style.removeProperty(vars[2]);
        }
    }
}

/* ── Apply theme class ── */

function applyThemeClass(theme: string) {
    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    } else if (theme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
}

/* ── Apply all settings ── */

function applySettings(settings: Record<string, unknown>) {
    if (settings.theme) applyThemeClass(settings.theme as string);
    applyAccentColors(settings);
}

/* ── Component ── */

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    // Initial mount: read and apply settings
    useEffect(() => {
        try {
            const stored = localStorage.getItem("unilife360-settings");
            if (stored) {
                const settings = JSON.parse(stored);
                applySettings(settings);
            }
        } catch {
            // ignore
        }
        setMounted(true);
    }, []);

    // Listen for cross-tab changes (StorageEvent)
    useEffect(() => {
        function handleStorage(e: StorageEvent) {
            if (e.key === "unilife360-settings" && e.newValue) {
                try {
                    applySettings(JSON.parse(e.newValue));
                } catch { /* ignore */ }
            }
        }
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    // Listen for same-tab changes (CustomEvent from settings page)
    useEffect(() => {
        function handleSettingsChanged(e: Event) {
            const detail = (e as CustomEvent).detail;
            if (detail) applySettings(detail);
        }
        window.addEventListener("unilife-settings-changed", handleSettingsChanged);
        return () => window.removeEventListener("unilife-settings-changed", handleSettingsChanged);
    }, []);

    if (!mounted) return null;

    return <>{children}</>;
}
