"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ModuleHeader } from "@/components/shared/module-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Palette,
  Bell,
  Layout,
  Shield,
  ArrowLeft,
  Sun,
  Moon,
  Monitor,
  Save,
  Wallet,
  GraduationCap,
  Users,
  Calendar,
} from "lucide-react";

interface AppSettings {
  theme: "light" | "dark" | "system";
  accentColor: string;
  fontSize: "small" | "medium" | "large";
  animations: boolean;
  notifFinance: boolean;
  notifSchedule: boolean;
  notifAcademic: boolean;
  notifSocial: boolean;
  notifAI: boolean;
  moduleFinance: boolean;
  moduleSchedule: boolean;
  moduleAcademic: boolean;
  moduleSocial: boolean;
  accentFinance: string;
  accentStudies: string;
  accentSocial: string;
  accentSport: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: "light",
  accentColor: "#86efac",
  fontSize: "medium",
  animations: true,
  notifFinance: true,
  notifSchedule: true,
  notifAcademic: true,
  notifSocial: true,
  notifAI: true,
  moduleFinance: true,
  moduleSchedule: true,
  moduleAcademic: true,
  moduleSocial: true,
  accentFinance: "#86efac",
  accentStudies: "#a78bfa",
  accentSocial: "#f9a8d4",
  accentSport: "#fdba74",
};

const ACCENT_COLORS = [
  { value: "#86efac", label: "Menthe", class: "bg-green-300" },
  { value: "#d8b4fe", label: "Lilas", class: "bg-purple-300" },
  { value: "#f9a8d4", label: "Rose", class: "bg-pink-300" },
  { value: "#fdba74", label: "Abricot", class: "bg-orange-300" },
  { value: "#93c5fd", label: "Ciel", class: "bg-blue-300" },
  { value: "#fca5a5", label: "Corail", class: "bg-red-300" },
  { value: "#fde68a", label: "Soleil", class: "bg-yellow-300" },
  { value: "#5eead4", label: "Turquoise", class: "bg-teal-300" },
];

const SECTION_COLORS = [
  { key: "accentFinance" as const, label: "Finance", icon: Wallet, defaultColor: "#86efac" },
  { key: "accentStudies" as const, label: "Études", icon: GraduationCap, defaultColor: "#a78bfa" },
  { key: "accentSocial" as const, label: "Social", icon: Users, defaultColor: "#f9a8d4" },
  { key: "accentSport" as const, label: "Planning", icon: Calendar, defaultColor: "#fdba74" },
];

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-7 rounded-full border-2 border-[var(--border)] transition-colors cursor-pointer flex-shrink-0 ${checked ? "bg-[var(--color-finance)]" : "bg-[var(--muted)]"
        }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-[var(--card)] border-2 border-[var(--border)] transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"
          }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("unilife360-settings");
    if (stored) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      } catch {
        // ignore
      }
    }
  }, []);

  function applyTheme(theme: string) {
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

  function updateSetting<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
    if (key === "theme") applyTheme(value as string);
  }

  function handleSave() {
    localStorage.setItem("unilife360-settings", JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent("unilife-settings-changed", { detail: settings }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="pb-24 md:pb-0">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Link>

      <ModuleHeader title="Paramètres" description="Personnalise ton expérience UniLife 360">
        <Button variant="default" onClick={handleSave} className="text-xs sm:text-sm">
          <Save className="w-4 h-4" />
          {saved ? "Enregistré !" : "Enregistrer"}
        </Button>
      </ModuleHeader>

      <div className="space-y-4 sm:space-y-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Palette className="w-5 h-5" />
              Apparence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 sm:space-y-6">
            {/* Theme */}
            <div>
              <label className="text-xs sm:text-sm font-bold block mb-3">Thème</label>
              <div className="flex gap-2 sm:gap-3">
                {(
                  [
                    { value: "light", icon: Sun, label: "Clair" },
                    { value: "dark", icon: Moon, label: "Sombre" },
                    { value: "system", icon: Monitor, label: "Système" },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateSetting("theme", option.value)}
                    className={`flex-1 h-14 sm:h-16 rounded-xl border-2 border-[var(--border)] flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${settings.theme === option.value
                        ? "bg-[var(--color-finance)] shadow-[var(--shadow-brutalist)]"
                        : "bg-[var(--card)] text-[var(--muted-foreground)] translate-x-[2px] translate-y-[2px]"
                      }`}
                  >
                    <option.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-[10px] sm:text-xs font-bold">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Global Accent Color */}
            <div>
              <label className="text-xs sm:text-sm font-bold block mb-3">
                Couleur d&apos;accent principale
              </label>
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => updateSetting("accentColor", color.value)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-[var(--border)] ${color.class} transition-all cursor-pointer ${settings.accentColor === color.value
                        ? "shadow-[var(--shadow-brutalist)] ring-2 ring-[var(--foreground)] ring-offset-2"
                        : ""
                      }`}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            {/* Per-Section Accent Colors */}
            <div>
              <label className="text-xs sm:text-sm font-bold block mb-3">
                Couleurs par section
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SECTION_COLORS.map((section) => (
                  <div key={section.key}
                    className="p-3 rounded-xl border-2 border-[var(--border)] bg-[var(--card)]">
                    <div className="flex items-center gap-2 mb-2.5">
                      <section.icon className="w-4 h-4" />
                      <span className="text-xs font-extrabold">{section.label}</span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {ACCENT_COLORS.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => updateSetting(section.key, color.value)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 border-[var(--border)] ${color.class} transition-all cursor-pointer ${settings[section.key] === color.value
                              ? "shadow-[var(--shadow-brutalist-sm)] ring-2 ring-[var(--foreground)] ring-offset-1 scale-110"
                              : "opacity-60 hover:opacity-100"
                            }`}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="text-xs sm:text-sm font-bold block mb-3">
                Taille de police
              </label>
              <div className="flex gap-2 sm:gap-3">
                {(
                  [
                    { value: "small", label: "Petit" },
                    { value: "medium", label: "Moyen" },
                    { value: "large", label: "Grand" },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateSetting("fontSize", option.value)}
                    className={`flex-1 h-10 sm:h-11 rounded-xl border-2 border-[var(--border)] text-xs sm:text-sm font-bold transition-all cursor-pointer ${settings.fontSize === option.value
                        ? "bg-[var(--color-finance)] shadow-[var(--shadow-brutalist)]"
                        : "bg-[var(--card)] text-[var(--muted-foreground)] translate-x-[2px] translate-y-[2px]"
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Animations */}
            <div className="flex items-center justify-between">
              <div className="mr-3">
                <p className="text-xs sm:text-sm font-bold">Animations</p>
                <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)]">
                  Active les transitions et animations de l&apos;interface
                </p>
              </div>
              <Toggle
                checked={settings.animations}
                onChange={(v) => updateSetting("animations", v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {(
              [
                { key: "notifFinance" as const, label: "Finance", desc: "Alertes budget, dépenses, conseils" },
                { key: "notifSchedule" as const, label: "Planning", desc: "Rappels de cours et événements" },
                { key: "notifAcademic" as const, label: "Études", desc: "Notes, examens, synthèses IA" },
                { key: "notifSocial" as const, label: "Social", desc: "Événements campus, cercles" },
                { key: "notifAI" as const, label: "Conseils 360", desc: "Suggestions et recommandations UniLife" },
              ] as const
            ).map((item) => (
              <div key={item.key} className="flex items-center justify-between py-1.5 sm:py-2">
                <div className="mr-3">
                  <p className="text-xs sm:text-sm font-bold">{item.label}</p>
                  <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)]">{item.desc}</p>
                </div>
                <Toggle
                  checked={settings[item.key]}
                  onChange={(v) => updateSetting(item.key, v)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Modules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Layout className="w-5 h-5" />
              Modules actifs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {(
              [
                { key: "moduleFinance" as const, label: "Finance", desc: "Budget, dépenses, conseiller IA", color: "bg-[var(--color-finance)]" },
                { key: "moduleSchedule" as const, label: "Emploi du temps", desc: "Calendrier, cours, suggestions", color: "bg-[var(--color-sport)]" },
                { key: "moduleAcademic" as const, label: "Études", desc: "Cours, notes, examens, tuteur IA", color: "bg-[var(--color-studies)]" },
                { key: "moduleSocial" as const, label: "Campus Social", desc: "Cercles, événements, billetterie", color: "bg-[var(--color-social)]" },
              ] as const
            ).map((item) => (
              <div key={item.key} className="flex items-center justify-between py-1.5 sm:py-2">
                <div className="flex items-center gap-2 sm:gap-3 mr-3">
                  <div className={`w-4 h-4 rounded border-2 border-[var(--border)] ${item.color} flex-shrink-0`} />
                  <div>
                    <p className="text-xs sm:text-sm font-bold">{item.label}</p>
                    <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)]">{item.desc}</p>
                  </div>
                </div>
                <Toggle
                  checked={settings[item.key]}
                  onChange={(v) => updateSetting(item.key, v)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Shield className="w-5 h-5" />
              Données et confidentialité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="brutalist-card p-3 sm:p-4 bg-[var(--muted)]">
              <p className="text-xs sm:text-sm font-bold mb-1">Données locales</p>
              <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)] mb-3">
                En mode démo, toutes tes données sont stockées localement dans
                ton navigateur. Rien n&apos;est envoyé à un serveur.
              </p>
              <Button
                variant="destructive"
                size="sm"
                className="text-xs"
                onClick={() => {
                  if (
                    confirm(
                      "Supprimer toutes les données locales ? Cette action est irréversible."
                    )
                  ) {
                    localStorage.removeItem("unilife-transactions");
                    localStorage.removeItem("unilife-schedule");
                    localStorage.removeItem("unilife360-profile");
                    localStorage.removeItem("unilife360-settings");
                    localStorage.removeItem("unilife360-courses");
                    window.location.reload();
                  }
                }}
              >
                Supprimer toutes les données locales
              </Button>
            </div>

            <div className="text-[10px] sm:text-xs text-[var(--muted-foreground)] space-y-1">
              <p className="font-bold">Version</p>
              <p>UniLife 360 — v0.3.0 (V3)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
