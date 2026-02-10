"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Users,
    MessageSquare,
    Camera,
    Info,
    Send,
    Hash,
} from "lucide-react";

interface Circle {
    id: string;
    name: string;
    members: number;
    description: string;
    tags: string[];
}

interface ChatMessage {
    id: string;
    author: string;
    text: string;
    time: string;
    channel: string;
}

const CHANNELS = [
    { key: "discussions", label: "Discussions", icon: MessageSquare },
    { key: "photos", label: "Photos", icon: Camera },
    { key: "infos", label: "Informations", icon: Info },
] as const;

type ChannelKey = (typeof CHANNELS)[number]["key"];

const DEFAULT_CIRCLES: Circle[] = [
    { id: "c1", name: "BDE Informatique", members: 156, description: "Le Bureau des Étudiants en Info", tags: ["Tech", "Soirées"] },
    { id: "c2", name: "Club Sport", members: 89, description: "Tous les sports universitaires", tags: ["Sport", "Santé"] },
    { id: "c3", name: "Asso Cinémaddict", members: 43, description: "Projections et débats ciné", tags: ["Culture", "Sorties"] },
    { id: "c4", name: "Entr'étudiants", members: 67, description: "Entraide et soutien entre étudiants", tags: ["Entraide", "Social"] },
];

const DEMO_MESSAGES: ChatMessage[] = [
    { id: "m1", author: "Marie L.", text: "Salut tout le monde ! Qui vient à la soirée vendredi ? 🎉", time: "14:32", channel: "discussions" },
    { id: "m2", author: "Thomas K.", text: "Moi je suis dispo ! On se retrouve à 20h devant le foyer ?", time: "14:35", channel: "discussions" },
    { id: "m3", author: "Sarah B.", text: "On a le nouveau programme des activités pour ce mois-ci", time: "10:15", channel: "infos" },
    { id: "m4", author: "Ahmed R.", text: "Voici les photos du dernier event ! C'était top 📸", time: "09:45", channel: "photos" },
];

const MEMBERS = [
    "Marie L.", "Thomas K.", "Sarah B.", "Ahmed R.", "Emma D.",
    "Lucas T.", "Chloé M.", "Hugo P.", "Léa R.", "Nathan B.",
];

const CIRCLES_STORAGE_KEY = "unilife360-circles";
const CHAT_STORAGE_KEY = "unilife360-chat";

export default function CircleDetailPage() {
    const params = useParams();
    const circleId = params.id as string;
    const [circle, setCircle] = useState<Circle | null>(null);
    const [activeChannel, setActiveChannel] = useState<ChannelKey>("discussions");
    const [messages, setMessages] = useState<ChatMessage[]>(DEMO_MESSAGES);
    const [newMessage, setNewMessage] = useState("");
    const [mounted, setMounted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(CIRCLES_STORAGE_KEY);
            if (saved) {
                const circles: Circle[] = JSON.parse(saved);
                const found = circles.find((c) => c.id === circleId);
                if (found) { setCircle(found); } else {
                    const defaultFound = DEFAULT_CIRCLES.find((c) => c.id === circleId);
                    if (defaultFound) setCircle(defaultFound);
                }
            } else {
                const defaultFound = DEFAULT_CIRCLES.find((c) => c.id === circleId);
                if (defaultFound) setCircle(defaultFound);
            }
            const savedChat = localStorage.getItem(`${CHAT_STORAGE_KEY}-${circleId}`);
            if (savedChat) setMessages(JSON.parse(savedChat));
        } catch { /* ignore */ }
        setMounted(true);
    }, [circleId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, activeChannel]);

    function handleSend() {
        if (!newMessage.trim()) return;
        const msg: ChatMessage = {
            id: Date.now().toString(),
            author: "Moi",
            text: newMessage.trim(),
            time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
            channel: activeChannel,
        };
        const updated = [...messages, msg];
        setMessages(updated);
        localStorage.setItem(`${CHAT_STORAGE_KEY}-${circleId}`, JSON.stringify(updated));
        setNewMessage("");
    }

    if (!mounted) return null;

    if (!circle) {
        return (
            <div className="space-y-6">
                <Link href="/social" className="inline-flex items-center gap-2 text-sm font-bold hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Retour aux cercles
                </Link>
                <Card><CardContent className="p-10 text-center"><p className="text-lg font-bold text-[var(--muted-foreground)]">Cercle introuvable</p></CardContent></Card>
            </div>
        );
    }

    const channelMessages = messages.filter((m) => m.channel === activeChannel);

    return (
        <div className="space-y-6">
            <Link href="/social" className="inline-flex items-center gap-2 text-sm font-bold hover:underline">
                <ArrowLeft className="w-4 h-4" /> Retour aux cercles
            </Link>

            {/* Circle Header */}
            <div className="brutalist-card p-6 bg-[var(--color-social)]">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold">{circle.name}</h1>
                        <p className="text-sm font-medium mt-1 opacity-80">{circle.description}</p>
                        <div className="flex gap-2 mt-3">
                            {circle.tags.map((tag) => (
                                <Badge key={tag} variant="social" className="text-xs">{tag}</Badge>
                            ))}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1.5 text-sm font-extrabold">
                            <Users className="w-4 h-4" />{circle.members} membres
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Chat Area */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Channel Tabs */}
                    <div className="flex gap-2">
                        {CHANNELS.map((ch) => {
                            const ChIcon = ch.icon;
                            return (
                                <button key={ch.key} onClick={() => setActiveChannel(ch.key)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${activeChannel === ch.key
                                            ? "border-[var(--border)] bg-[var(--color-social)] shadow-[var(--shadow-brutalist-sm)]"
                                            : "border-transparent hover:border-[var(--border)] hover:bg-[var(--muted)]"
                                        }`}>
                                    <Hash className="w-3.5 h-3.5" /><ChIcon className="w-4 h-4" />{ch.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Messages */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="h-[400px] overflow-y-auto p-5 space-y-4">
                                {channelMessages.length === 0 ? (
                                    <div className="text-center py-16">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-[var(--muted-foreground)] opacity-40" />
                                        <p className="text-sm font-bold text-[var(--muted-foreground)]">Aucun message dans ce canal</p>
                                    </div>
                                ) : (
                                    channelMessages.map((msg) => (
                                        <div key={msg.id} className={`flex gap-3 ${msg.author === "Moi" ? "flex-row-reverse" : ""}`}>
                                            <div className="w-9 h-9 rounded-full border-2 border-[var(--border)] bg-[var(--muted)] flex items-center justify-center text-xs font-extrabold shrink-0">
                                                {msg.author.charAt(0)}
                                            </div>
                                            <div className={`max-w-[70%] ${msg.author === "Moi" ? "text-right" : ""}`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-extrabold">{msg.author}</span>
                                                    <span className="text-[10px] text-[var(--muted-foreground)]">{msg.time}</span>
                                                </div>
                                                <div className={`inline-block px-4 py-2.5 rounded-2xl text-sm font-medium ${msg.author === "Moi"
                                                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] rounded-tr-md"
                                                        : "bg-[var(--muted)] border-2 border-[var(--border)] rounded-tl-md"
                                                    }`}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="border-t-2 border-[var(--border)] p-4">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                                        placeholder={`Message dans #${CHANNELS.find((c) => c.key === activeChannel)?.label}...`}
                                        className="flex-1 px-4 py-3 border-2 border-[var(--border)] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                    />
                                    <Button onClick={handleSend} disabled={!newMessage.trim()}>
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Members Sidebar */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Users className="w-4 h-4" />Membres
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {MEMBERS.slice(0, Math.min(MEMBERS.length, circle.members)).map((member) => (
                                <div key={member} className="flex items-center gap-2.5 py-1.5">
                                    <div className="w-7 h-7 rounded-full border-2 border-[var(--border)] bg-[var(--muted)] flex items-center justify-center text-[10px] font-extrabold">
                                        {member.charAt(0)}
                                    </div>
                                    <span className="text-sm font-medium">{member}</span>
                                </div>
                            ))}
                            {circle.members > MEMBERS.length && (
                                <p className="text-xs text-[var(--muted-foreground)] text-center pt-2">
                                    +{circle.members - MEMBERS.length} autres membres
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
