"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ModuleHeader } from "@/components/shared/module-header";
import {
    Wallet,
    Calendar,
    GraduationCap,
    Users,
    Dumbbell,
    TrendingUp,
    TrendingDown,
    Clock,
    BookOpen,
    PartyPopper,
    Trophy,
    ArrowRight,
    Sparkles,
} from "lucide-react";

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 6) return "Bonne nuit";
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
}

interface WidgetData {
    title: string;
    href: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    stats: { label: string; value: string; icon: React.ElementType; trend?: "up" | "down" }[];
    cta: string;
}

const PROFILE_STORAGE_KEY = "unilife360-profile";

export default function DashboardPage() {
    const [userName, setUserName] = useState("Étudiant");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.nomComplet) {
                    setUserName(parsed.nomComplet.split(" ")[0]);
                }
            }
        } catch {
            // ignore
        }
        setMounted(true);
    }, []);

    const widgets: WidgetData[] = [
        {
            title: "Finance",
            href: "/finance",
            icon: Wallet,
            color: "border-[var(--color-finance)]",
            bgColor: "bg-[var(--color-finance)]",
            stats: [
                { label: "Revenus du mois", value: "1 097,00 €", icon: TrendingUp, trend: "up" },
                { label: "Dépenses", value: "946,28 €", icon: TrendingDown, trend: "down" },
                { label: "Reste à vivre", value: "253,72 €", icon: Wallet },
            ],
            cta: "Voir mes finances",
        },
        {
            title: "Emploi du temps",
            href: "/schedule",
            icon: Calendar,
            color: "border-[var(--color-sport)]",
            bgColor: "bg-[var(--color-sport)]",
            stats: [
                { label: "Prochain cours", value: "Maths — 10h00", icon: Clock },
                { label: "Cours aujourd'hui", value: "3 cours", icon: Calendar },
                { label: "Heures cette semaine", value: "18h", icon: BookOpen },
            ],
            cta: "Voir mon planning",
        },
        {
            title: "Études",
            href: "/academic",
            icon: GraduationCap,
            color: "border-[var(--color-studies)]",
            bgColor: "bg-[var(--color-studies)]",
            stats: [
                { label: "Cours ajoutés", value: "6 cours", icon: BookOpen },
                { label: "Notes enregistrées", value: "24 notes", icon: GraduationCap },
                { label: "Prochain examen", value: "15 Fév", icon: Clock },
            ],
            cta: "Voir mes cours",
        },
        {
            title: "Social",
            href: "/social",
            icon: Users,
            color: "border-[var(--color-social)]",
            bgColor: "bg-[var(--color-social)]",
            stats: [
                { label: "Événements à venir", value: "3 events", icon: PartyPopper },
                { label: "Cercles rejoints", value: "4 cercles", icon: Users },
                { label: "Amis", value: "28 amis", icon: Users },
            ],
            cta: "Voir la vie sociale",
        },
        {
            title: "Sport",
            href: "/sport",
            icon: Dumbbell,
            color: "border-[var(--color-sport)]",
            bgColor: "bg-[var(--color-sport)]",
            stats: [
                { label: "Séances cette semaine", value: "3 / 4", icon: Dumbbell },
                { label: "Objectif hebdo", value: "75%", icon: Trophy },
                { label: "Calories brûlées", value: "1 240 kcal", icon: TrendingUp, trend: "up" },
            ],
            cta: "Voir mes entraînements",
        },
    ];

    if (!mounted) return null;

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="brutalist-card p-6 md:p-8 bg-gradient-to-br from-[var(--color-finance)] via-[var(--color-studies)] to-[var(--color-social)]">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold border-2 border-black rounded-full bg-[var(--card)]/80 mb-4">
                            <Sparkles className="w-3.5 h-3.5" />
                            Assistant IA actif
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                            {getGreeting()}, {userName} 👋
                        </h1>
                        <p className="text-sm md:text-base font-medium opacity-80 max-w-lg">
                            Voici un résumé de ta journée. Clique sur un module pour plus de détails.
                        </p>
                    </div>
                </div>
            </div>

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {widgets.map((widget) => {
                    const Icon = widget.icon;
                    return (
                        <Link key={widget.title} href={widget.href} className="group">
                            <Card hover className="h-full transition-all duration-200 group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]">
                                <CardContent className="p-0">
                                    {/* Header */}
                                    <div className={`${widget.bgColor} px-5 py-4 flex items-center justify-between border-b-2 border-[var(--border)] rounded-t-xl`}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl border-2 border-black bg-[var(--card)] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-lg font-extrabold">{widget.title}</h3>
                                        </div>
                                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                    </div>

                                    {/* Stats */}
                                    <div className="p-5 space-y-3.5">
                                        {widget.stats.map((stat) => {
                                            const StatIcon = stat.icon;
                                            return (
                                                <div key={stat.label} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2.5">
                                                        <StatIcon className={`w-4 h-4 ${stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-500" : "text-[var(--muted-foreground)]"
                                                            }`} />
                                                        <span className="text-sm font-medium text-[var(--muted-foreground)]">{stat.label}</span>
                                                    </div>
                                                    <span className="text-sm font-extrabold">{stat.value}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* CTA */}
                                    <div className="px-5 pb-4">
                                        <div className="text-xs font-bold text-[var(--primary)] flex items-center gap-1 group-hover:gap-2 transition-all">
                                            {widget.cta}
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {/* Quick AI Tip */}
            <Card>
                <CardContent className="p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl border-2 border-[var(--border)] bg-[var(--color-finance)] flex items-center justify-center shrink-0 shadow-[var(--shadow-brutalist-sm)]">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-extrabold text-sm mb-1">💡 Conseil IA du jour</h4>
                        <p className="text-sm text-[var(--muted-foreground)]">
                            Tu as un examen de Maths la semaine prochaine. Pense à réviser les chapitres 3 et 4 qui représentent 60% du barème. Je peux te générer des fiches de révision si tu veux !
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
