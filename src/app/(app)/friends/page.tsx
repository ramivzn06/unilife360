"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModuleHeader } from "@/components/shared/module-header";
import { Badge } from "@/components/ui/badge";
import {
    Heart, Search, UserPlus, Calendar, Clock, CheckCircle2, XCircle,
    Share2, MessageSquare, Send, X, ArrowLeft, Copy, AtSign, BookOpen,
    Gift, Link2, Users,
} from "lucide-react";

interface Friend {
    id: string;
    name: string;
    username: string;
    university: string;
    field: string;
    avatar: string;
    status: "online" | "offline";
    commonSlots: number;
}

interface ChatMsg {
    id: string;
    from: "me" | "them";
    text: string;
    time: string;
}

const DEMO_FRIENDS: Friend[] = [
    { id: "f1", name: "Marie Lambert", username: "@marie_l", university: "ULB", field: "Informatique", avatar: "ML", status: "online", commonSlots: 5 },
    { id: "f2", name: "Thomas Kerr", username: "@thomas.k", university: "UCLouvain", field: "Sciences éco", avatar: "TK", status: "online", commonSlots: 3 },
    { id: "f3", name: "Sarah Benoît", username: "@sarah.b", university: "ULB", field: "Informatique", avatar: "SB", status: "offline", commonSlots: 7 },
    { id: "f4", name: "Ahmed Rahmani", username: "@ahmed_r", university: "VUB", field: "Ingénierie", avatar: "AR", status: "online", commonSlots: 2 },
    { id: "f5", name: "Emma Dubois", username: "@emma.d", university: "ULB", field: "Droit", avatar: "ED", status: "offline", commonSlots: 1 },
    { id: "f6", name: "Lucas Moreau", username: "@lucas.m", university: "ULiège", field: "Médecine", avatar: "LM", status: "offline", commonSlots: 0 },
];

const DEMO_REQUESTS = [
    { id: "r1", name: "Hugo Petit", username: "@hugo.p", university: "UCLouvain", field: "Informatique" },
    { id: "r2", name: "Chloé Martin", username: "@chloe.m", university: "ULB", field: "Sciences politiques" },
];

const MATCH_SLOTS = [
    { day: "Lundi", slots: ["12h-14h", "16h-18h"] },
    { day: "Mercredi", slots: ["10h-12h"] },
    { day: "Vendredi", slots: ["14h-16h", "18h-20h"] },
];

const DEMO_MESSAGES: Record<string, ChatMsg[]> = {
    f1: [
        { id: "m1", from: "them", text: "Salut ! Tu as compris l'exo de structures de données ?", time: "14:30" },
        { id: "m2", from: "me", text: "Oui ! C'est sur les arbres AVL, je te montre demain ?", time: "14:32" },
        { id: "m3", from: "them", text: "Trop bien merci 🙏 On se voit à la biblio ?", time: "14:33" },
    ],
    f3: [
        { id: "m4", from: "them", text: "Tu viens au cours de Méot demain ?", time: "18:15" },
        { id: "m5", from: "me", text: "Oui j'y serai ! On se met ensemble ?", time: "18:20" },
    ],
};

export default function FriendsPage() {
    const [friends] = useState<Friend[]>(DEMO_FRIENDS);
    const [requests, setRequests] = useState(DEMO_REQUESTS);
    const [search, setSearch] = useState("");
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
    const [chatFriend, setChatFriend] = useState<Friend | null>(null);
    const [chatMessages, setChatMessages] = useState<Record<string, ChatMsg[]>>(DEMO_MESSAGES);
    const [msgInput, setMsgInput] = useState("");
    const [showShareModal, setShowShareModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copiedReferral, setCopiedReferral] = useState(false);
    const [globalSearch, setGlobalSearch] = useState("");
    const [searchResults, setSearchResults] = useState<{ id: string; name: string; username: string; university: string; field: string }[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, chatFriend]);

    function handleAccept(id: string) { setRequests((prev) => prev.filter((r) => r.id !== id)); }
    function handleDecline(id: string) { setRequests((prev) => prev.filter((r) => r.id !== id)); }

    const filteredFriends = friends.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.username.toLowerCase().includes(search.toLowerCase()) ||
        f.university.toLowerCase().includes(search.toLowerCase()) ||
        f.field.toLowerCase().includes(search.toLowerCase())
    );

    function handleSendMessage() {
        if (!msgInput.trim() || !chatFriend) return;
        const newMsg: ChatMsg = {
            id: Date.now().toString(),
            from: "me",
            text: msgInput.trim(),
            time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        };
        setChatMessages((prev) => ({
            ...prev,
            [chatFriend.id]: [...(prev[chatFriend.id] || []), newMsg],
        }));
        setMsgInput("");
    }

    function handleCopyProfile() {
        navigator.clipboard.writeText(`${window.location.origin}/invite/rami_demo`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function handleCopyReferral() {
        navigator.clipboard.writeText("UNILIFE-R4M1");
        setCopiedReferral(true);
        setTimeout(() => setCopiedReferral(false), 2000);
    }

    function handleGlobalSearch(q: string) {
        setGlobalSearch(q);
        if (q.length >= 2) {
            // Demo search results
            const demoUsers = [
                { id: "s1", name: "Julie Vandenberghe", username: "@julie.v", university: "ULB", field: "Psychologie" },
                { id: "s2", name: "Maxime Renard", username: "@max.r", university: "UCLouvain", field: "Informatique" },
                { id: "s3", name: "Amina Benali", username: "@amina.b", university: "VUB", field: "Médecine" },
            ].filter((u) =>
                u.name.toLowerCase().includes(q.toLowerCase()) ||
                u.username.toLowerCase().includes(q.toLowerCase()) ||
                u.university.toLowerCase().includes(q.toLowerCase())
            );
            setSearchResults(demoUsers);
        } else {
            setSearchResults([]);
        }
    }

    return (
        <div className="space-y-4 sm:space-y-6 pb-24 md:pb-0">
            <ModuleHeader title="Amis" description="Retrouve tes amis, compare vos emplois du temps et discutez">
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowShareModal(true)} className="text-xs sm:text-sm">
                        <AtSign className="w-4 h-4" />
                        <span className="hidden sm:inline">Mon profil</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopyReferral} className="text-xs sm:text-sm">
                        <Gift className="w-4 h-4" />
                        <span className="hidden sm:inline">{copiedReferral ? "Copié !" : "Parrainer"}</span>
                    </Button>
                    <Button variant="social" className="text-xs sm:text-sm" onClick={() => setShowInviteModal(true)}>
                        <UserPlus className="w-4 h-4" />
                        <span className="hidden sm:inline">Inviter</span>
                        <span className="sm:hidden">Inviter</span>
                    </Button>
                </div>
            </ModuleHeader>

            {/* Requests Section */}
            {requests.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            Demandes d&apos;amis ({requests.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 sm:space-y-3">
                        {requests.map((req) => (
                            <div key={req.id} className="flex items-center justify-between p-2 sm:p-3 rounded-xl border-2 border-[var(--border)] bg-[var(--muted)]">
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[var(--border)] bg-[var(--color-social)] flex items-center justify-center text-[10px] sm:text-xs font-extrabold flex-shrink-0">
                                        {req.name.split(" ").map((n) => n[0]).join("")}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm font-extrabold truncate">{req.name}</p>
                                        <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)] truncate">{req.username} · {req.university} · {req.field}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                                    <button onClick={() => handleAccept(req.id)} className="p-1.5 sm:p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
                                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                    <button onClick={() => handleDecline(req.id)} className="p-1.5 sm:p-2 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition-colors">
                                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Friends List */}
                <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher par nom, @username, université..."
                            className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 border-2 border-[var(--border)] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--card)]" />
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {filteredFriends.map((friend) => (
                            <Card key={friend.id} hover>
                                <CardContent className="p-3 sm:p-4">
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[var(--border)] bg-[var(--color-social)] flex items-center justify-center text-xs sm:text-sm font-extrabold">
                                                {friend.avatar}
                                            </div>
                                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-[var(--card)] ${friend.status === "online" ? "bg-green-500" : "bg-gray-300"}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs sm:text-sm font-extrabold truncate">{friend.name}</p>
                                            <p className="text-[10px] sm:text-xs text-[var(--color-social-dark)] font-bold">{friend.username}</p>
                                            <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)]">{friend.university} · {friend.field}</p>
                                            {friend.commonSlots > 0 && (
                                                <div className="mt-1.5 sm:mt-2 inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 sm:py-1 rounded-lg border border-green-200">
                                                    <Clock className="w-3 h-3" />
                                                    {friend.commonSlots} créneaux communs
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                                        <Button variant="outline" size="sm" className="flex-1 text-[10px] sm:text-xs" onClick={() => setSelectedFriend(friend)}>
                                            <Calendar className="w-3 h-3" /> Matcher
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1 text-[10px] sm:text-xs" onClick={() => setChatFriend(friend)}>
                                            <MessageSquare className="w-3 h-3" /> Message
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-[10px] sm:text-xs px-2">
                                            <Share2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Matching Sidebar */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {selectedFriend ? `Créneaux avec ${selectedFriend.name.split(" ")[0]}` : "Créneaux communs"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedFriend ? (
                                <div className="space-y-4">
                                    {MATCH_SLOTS.map((slot) => (
                                        <div key={slot.day}>
                                            <p className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">{slot.day}</p>
                                            <div className="space-y-1.5">
                                                {slot.slots.map((s) => (
                                                    <div key={s} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-xs sm:text-sm font-bold text-green-700">
                                                        <Clock className="w-3.5 h-3.5" />{s}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <Button variant="studies" size="sm" className="w-full text-xs">
                                        <BookOpen className="w-3.5 h-3.5" />
                                        Proposer une session d&apos;étude
                                    </Button>
                                    <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)] text-center">
                                        {MATCH_SLOTS.reduce((acc, s) => acc + s.slots.length, 0)} créneaux libres en commun
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-6 sm:py-8">
                                    <Calendar className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 text-[var(--muted-foreground)] opacity-40" />
                                    <p className="text-xs sm:text-sm font-bold text-[var(--muted-foreground)]">Sélectionne un ami</p>
                                    <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)] mt-1">
                                        Clique sur &quot;Matcher&quot; pour comparer vos emplois du temps
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                        <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                                <span className="font-medium text-[var(--muted-foreground)]">Amis</span>
                                <span className="font-extrabold">{friends.length}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                                <span className="font-medium text-[var(--muted-foreground)]">En ligne</span>
                                <span className="font-extrabold text-green-600">{friends.filter((f) => f.status === "online").length}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                                <span className="font-medium text-[var(--muted-foreground)]">Même filière</span>
                                <span className="font-extrabold">{friends.filter((f) => f.field === "Informatique").length}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* ====== MESSAGING PANEL ====== */}
            {chatFriend && (
                <div className="fixed inset-0 sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[420px] z-50 flex flex-col bg-[var(--background)] border-l-0 sm:border-l-2 border-[var(--border)] shadow-2xl">
                    {/* Chat Header */}
                    <div className="flex items-center gap-3 p-4 border-b-2 border-[var(--border)] flex-shrink-0">
                        <button onClick={() => setChatFriend(null)} className="p-2 rounded-xl hover:bg-[var(--muted)] transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full border-2 border-[var(--border)] bg-[var(--color-social)] flex items-center justify-center text-xs font-extrabold">
                                {chatFriend.avatar}
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--card)] ${chatFriend.status === "online" ? "bg-green-500" : "bg-gray-300"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-extrabold truncate">{chatFriend.name}</p>
                            <p className="text-xs text-[var(--muted-foreground)]">{chatFriend.username} · {chatFriend.status === "online" ? "En ligne" : "Hors ligne"}</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {(chatMessages[chatFriend.id] || []).map((msg) => (
                            <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[80%] px-3 py-2 rounded-2xl ${msg.from === "me"
                                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] rounded-br-md"
                                        : "bg-[var(--muted)] rounded-bl-md"
                                    }`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-[10px] mt-1 ${msg.from === "me" ? "opacity-60 text-right" : "text-[var(--muted-foreground)]"}`}>{msg.time}</p>
                                </div>
                            </div>
                        ))}
                        {(!chatMessages[chatFriend.id] || chatMessages[chatFriend.id].length === 0) && (
                            <div className="text-center py-12">
                                <MessageSquare className="w-10 h-10 mx-auto mb-3 text-[var(--muted-foreground)] opacity-40" />
                                <p className="text-sm font-bold text-[var(--muted-foreground)]">Aucun message</p>
                                <p className="text-xs text-[var(--muted-foreground)] mt-1">Envoie un message à {chatFriend.name.split(" ")[0]} !</p>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t-2 border-[var(--border)] flex-shrink-0 pb-[env(safe-area-inset-bottom)]">
                        {/* Quick Actions */}
                        <div className="flex gap-2 mb-2 flex-wrap">
                            <button
                                onClick={() => {
                                    if (!chatFriend) return;
                                    const slots = MATCH_SLOTS.flatMap((s) => s.slots.map((slot) => `${s.day} ${slot}`));
                                    const text = slots.length > 0
                                        ? `Je suis dispo : ${slots.slice(0, 3).join(", ")}. Ça te va ?`
                                        : "J'ai un planning chargé cette semaine... Tu as des créneaux libres ?";
                                    const newMsg: ChatMsg = {
                                        id: Date.now().toString(),
                                        from: "me",
                                        text,
                                        time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
                                    };
                                    setChatMessages((prev) => ({
                                        ...prev,
                                        [chatFriend.id]: [...(prev[chatFriend.id] || []), newMsg],
                                    }));
                                }}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[var(--color-sport-light)] border-2 border-[var(--border)] text-[10px] sm:text-xs font-bold hover:bg-[var(--color-sport)] transition-colors cursor-pointer"
                            >
                                <Clock className="w-3 h-3" />
                                Proposer un créneau
                            </button>
                            <button
                                onClick={() => {
                                    if (!chatFriend) return;
                                    const text = "📅 Mon emploi du temps cette semaine :\n• Lun 08h-10h Maths (Amphi A)\n• Lun 14h-16h TD Info (Salle 204)\n• Mar 17h-19h Football (Stade)\n• Mer 10h-12h Anglais (Salle 105)\n🔗 Voir en détail : unilife360.app/share/schedule/rami_demo";
                                    const newMsg: ChatMsg = {
                                        id: Date.now().toString(),
                                        from: "me",
                                        text,
                                        time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
                                    };
                                    setChatMessages((prev) => ({
                                        ...prev,
                                        [chatFriend.id]: [...(prev[chatFriend.id] || []), newMsg],
                                    }));
                                }}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[var(--color-studies-light)] border-2 border-[var(--border)] text-[10px] sm:text-xs font-bold hover:bg-[var(--color-studies)] transition-colors cursor-pointer"
                            >
                                <Calendar className="w-3 h-3" />
                                Partager mon horaire
                            </button>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
                            <input type="text" value={msgInput} onChange={(e) => setMsgInput(e.target.value)}
                                placeholder="Ton message..."
                                className="flex-1 px-3 py-2.5 border-2 border-[var(--border)] rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--card)]" />
                            <Button type="submit" variant="social" disabled={!msgInput.trim()} className="px-3">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* ====== INVITE / SEARCH MODAL ====== */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
                    <div className="brutalist-card w-full sm:max-w-md bg-[var(--background)] rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-extrabold flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Rechercher un ami
                            </h3>
                            <button onClick={() => { setShowInviteModal(false); setGlobalSearch(""); setSearchResults([]); }} className="p-2 rounded-xl hover:bg-[var(--muted)]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search input */}
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                            <input
                                type="text" value={globalSearch}
                                onChange={(e) => handleGlobalSearch(e.target.value)}
                                placeholder="Nom, @username, université..."
                                className="w-full pl-10 pr-4 py-2.5 border-2 border-[var(--border)] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--card)]"
                                autoFocus
                            />
                        </div>

                        {/* Results */}
                        {searchResults.length > 0 && (
                            <div className="space-y-2">
                                {searchResults.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-3 rounded-xl border-2 border-[var(--border)] bg-[var(--muted)]">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-full border-2 border-[var(--border)] bg-[var(--color-social)] flex items-center justify-center text-xs font-extrabold flex-shrink-0">
                                                {user.name.split(" ").map((n) => n[0]).join("")}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-extrabold truncate">{user.name}</p>
                                                <p className="text-xs text-[var(--muted-foreground)] truncate">{user.username} · {user.university}</p>
                                            </div>
                                        </div>
                                        <Button variant="social" size="sm" className="text-xs flex-shrink-0">
                                            <UserPlus className="w-3.5 h-3.5" />
                                            Ajouter
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {globalSearch.length >= 2 && searchResults.length === 0 && (
                            <div className="text-center py-6">
                                <Search className="w-8 h-8 mx-auto mb-2 text-[var(--muted-foreground)] opacity-40" />
                                <p className="text-sm font-bold text-[var(--muted-foreground)]">Aucun résultat</p>
                                <p className="text-xs text-[var(--muted-foreground)] mt-1">Invite cette personne via ton lien !</p>
                            </div>
                        )}

                        {globalSearch.length < 2 && (
                            <div className="text-center py-6">
                                <Users className="w-8 h-8 mx-auto mb-2 text-[var(--muted-foreground)] opacity-40" />
                                <p className="text-sm font-bold text-[var(--muted-foreground)]">Recherche par nom ou @username</p>
                            </div>
                        )}

                        {/* Share invite link */}
                        <div className="mt-4 pt-4 border-t-2 border-dashed border-[var(--border)]">
                            <p className="text-xs font-bold text-[var(--muted-foreground)] mb-2">Ou invite via lien :</p>
                            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--muted)] border-2 border-[var(--border)]">
                                <Link2 className="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0" />
                                <span className="text-xs font-medium flex-1 truncate">unilife360.app/invite/rami_demo</span>
                                <button onClick={handleCopyProfile} className="p-1.5 rounded-lg hover:bg-[var(--card)] transition-colors">
                                    <Copy className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ====== SHARE PROFILE MODAL ====== */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
                    <div className="brutalist-card w-full sm:max-w-sm bg-[var(--background)] rounded-t-2xl sm:rounded-2xl p-5 sm:p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-extrabold">Mon profil UniLife</h3>
                            <button onClick={() => setShowShareModal(false)} className="p-2 rounded-xl hover:bg-[var(--muted)]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 rounded-full border-2 border-[var(--border)] bg-[var(--color-social)] flex items-center justify-center text-2xl font-extrabold mx-auto shadow-[var(--shadow-brutalist)]">
                                RD
                            </div>
                            <div>
                                <p className="text-lg font-extrabold">Rami Demo</p>
                                <p className="text-sm font-bold text-[var(--color-social-dark)]">@rami_demo</p>
                                <p className="text-xs text-[var(--muted-foreground)] mt-1">ULB · Informatique</p>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--muted)] border-2 border-[var(--border)]">
                                <AtSign className="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0" />
                                <span className="text-sm font-medium flex-1 text-left truncate">unilife360.app/@rami_demo</span>
                                <button onClick={handleCopyProfile} className="p-1.5 rounded-lg hover:bg-[var(--card)] transition-colors">
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                            {copied && (
                                <p className="text-xs font-bold text-green-600 animate-pulse">✓ Lien copié !</p>
                            )}
                            <p className="text-xs text-[var(--muted-foreground)]">
                                Partage ce lien pour que tes amis puissent te retrouver sur UniLife 360
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
