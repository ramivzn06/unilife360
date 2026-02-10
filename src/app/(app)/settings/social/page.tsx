"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Instagram,
    Twitter,
    MessageCircle,
    Gamepad2,
    Ghost,
    Check,
    Link as LinkIcon,
    Unlink,
} from "lucide-react";

const SOCIAL_NETWORKS = [
    {
        id: "instagram",
        name: "Instagram",
        icon: Instagram,
        color: "bg-gradient-to-br from-purple-500 to-pink-500",
        textColor: "text-white",
        description: "🤖 L'IA détecte les événements étudiants depuis tes stories et celles de tes amis",
    },
    {
        id: "tiktok",
        name: "TikTok",
        icon: Ghost,
        color: "bg-black",
        textColor: "text-white",
        description: "🤖 L'IA repère les événements campus et bons plans dans ton feed TikTok",
    },
    {
        id: "discord",
        name: "Discord",
        icon: Gamepad2,
        color: "bg-[#5865F2]",
        textColor: "text-white",
        description: "🎮 Rejoins les serveurs gaming et communautés de ton université",
    },
    {
        id: "snapchat",
        name: "Snapchat",
        icon: Ghost,
        color: "bg-[#FFFC00]",
        textColor: "text-black",
        description: "👻 Retrouve automatiquement tes amis de promo sur Snapchat",
    },
    {
        id: "x",
        name: "X (Twitter)",
        icon: Twitter,
        color: "bg-black",
        textColor: "text-white",
        description: "🤖 L'IA compose un fil d'actualités quotidien personnalisé de ton campus et ta filière",
    },
];

export default function SocialSettingsPage() {
    const [connected, setConnected] = useState<Record<string, boolean>>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("unilife-social-connections");
            return stored ? JSON.parse(stored) : {};
        }
        return {};
    });

    function toggleConnection(id: string) {
        setConnected((prev) => {
            const next = { ...prev, [id]: !prev[id] };
            localStorage.setItem("unilife-social-connections", JSON.stringify(next));
            return next;
        });
    }

    const connectedCount = Object.values(connected).filter(Boolean).length;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold mb-2">Réseaux sociaux</h1>
                <p className="text-sm text-[var(--muted-foreground)] font-medium">
                    Connecte tes réseaux pour enrichir ton expérience UniLife 360.
                    {connectedCount > 0 && (
                        <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 bg-[var(--color-finance)] rounded-full text-xs font-extrabold border border-[var(--border)]">
                            <Check className="w-3 h-3" />
                            {connectedCount} connecté{connectedCount > 1 ? "s" : ""}
                        </span>
                    )}
                </p>
            </div>

            <div className="grid gap-4">
                {SOCIAL_NETWORKS.map((network) => {
                    const isConnected = connected[network.id];
                    return (
                        <div
                            key={network.id}
                            className={`brutalist-card p-6 flex items-center gap-5 transition-all ${isConnected ? "ring-2 ring-[var(--color-finance)]" : ""
                                }`}
                        >
                            <div
                                className={`w-12 h-12 ${network.color} ${network.textColor} rounded-xl border-2 border-[var(--border)] shadow-[var(--shadow-brutalist-sm)] flex items-center justify-center shrink-0`}
                            >
                                <network.icon className="w-6 h-6" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-extrabold text-base">{network.name}</h3>
                                <p className="text-xs text-[var(--muted-foreground)] font-medium">
                                    {network.description}
                                </p>
                            </div>

                            <Button
                                variant={isConnected ? "destructive" : "default"}
                                size="sm"
                                onClick={() => toggleConnection(network.id)}
                                className="shrink-0"
                            >
                                {isConnected ? (
                                    <>
                                        <Unlink className="w-4 h-4" />
                                        Déconnecter
                                    </>
                                ) : (
                                    <>
                                        <LinkIcon className="w-4 h-4" />
                                        Connecter
                                    </>
                                )}
                            </Button>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 brutalist-card p-6 bg-[var(--muted)]">
                <p className="text-xs text-[var(--muted-foreground)] font-medium">
                    <strong>Note :</strong> La connexion aux réseaux sociaux est simulée pour le moment.
                    Dans une version future, elle permettra de partager automatiquement tes événements,
                    de rejoindre des groupes et d&apos;inviter tes amis sur UniLife 360.
                </p>
            </div>
        </div>
    );
}
