"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ModuleHeader } from "@/components/shared/module-header";
import { Bot, Send, ArrowLeft, BookOpen, FileQuestion, FileText, Sparkles, GraduationCap } from "lucide-react";

interface Course { id: string; name: string; code: string; professor: string; }
interface Message { id: string; role: "user" | "ai"; content: string; time: string; }

const AI_RESPONSES: Record<string, string[]> = {
    concept: [
        "📚 **Explication du concept:**\n\nLes **structures de données** sont des moyens d'organiser et stocker les données pour y accéder et les modifier efficacement.\n\n**Types principaux :**\n- **Tableaux** : Accès O(1), insertion O(n)\n- **Listes chaînées** : Insertion O(1), accès O(n)\n- **Arbres binaires** : Recherche O(log n)\n- **Tables de hachage** : Accès moyen O(1)\n\nChaque structure a ses forces et faiblesses selon le cas d'utilisation. Le choix dépend des opérations les plus fréquentes dans ton programme.",
        "📚 **Concept clé : La récursivité**\n\nLa récursivité est une technique où une fonction s'appelle elle-même pour résoudre des sous-problèmes identiques.\n\n**Éléments essentiels :**\n1. **Cas de base** : Condition d'arrêt\n2. **Cas récursif** : L'appel à soi-même\n3. **Convergence** : Chaque appel se rapproche du cas de base\n\n**Exemple : Factorielle**\n```\nfact(n) = n × fact(n-1)\nfact(0) = 1\n```\n\n💡 Pense toujours à vérifier que ta récursion converge !",
    ],
    summary: [
        "📝 **Résumé du chapitre :**\n\n**Chapitre 3 - Algorithmes de tri**\n\n1. **Tri par sélection** - O(n²) - Simple mais lent\n2. **Tri par insertion** - O(n²) - Efficace pour petites listes\n3. **Tri fusion** - O(n log n) - Diviser pour régner\n4. **Tri rapide** - O(n log n) moyen - Le plus utilisé en pratique\n\n**Points clés :**\n- Stabilité : fusion oui, rapide non\n- Espace : fusion O(n), rapide O(log n)\n- En pratique, le tri rapide est souvent le meilleur choix\n\n📌 Pour l'examen, maîtrise la complexité de chaque algorithme.",
    ],
    exam: [
        "📋 **Questions d'examen probables :**\n\n**Q1.** Quelle est la complexité temporelle du tri fusion dans le pire cas ?\n→ O(n log n)\n\n**Q2.** Expliquez la différence entre une pile et une file.\n→ Pile : LIFO (Last In, First Out)\n→ File : FIFO (First In, First Out)\n\n**Q3.** Implémentez une recherche binaire récursive.\n→ Cas de base : début > fin → non trouvé\n→ Cas récursif : comparer avec milieu, chercher à gauche ou droite\n\n**Q4.** Qu'est-ce qu'un arbre AVL et pourquoi est-il utile ?\n→ Arbre BST auto-équilibré, garantit O(log n) pour les opérations\n\n💡 Conseils : Entraîne-toi à écrire du pseudocode sur papier !",
    ],
    default: [
        "🤖 Je suis ton tuteur IA ! Je suis là pour t'aider avec tes cours.\n\nVoici ce que je peux faire :\n- **Expliquer des concepts** de tes cours\n- **Résumer des chapitres** pour tes révisions\n- **Générer des questions d'examen** pour t'entraîner\n- **Résoudre des exercices** étape par étape\n\nPose-moi ta question ou utilise les boutons rapides ci-dessous ! 👇",
    ],
};

export default function TutorPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [mounted, setMounted] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem("unilife360-courses");
            if (saved) {
                const parsed = JSON.parse(saved);
                setCourses(parsed);
                if (parsed.length > 0) setSelectedCourse(parsed[0].id);
            }
        } catch { /* ignore */ }

        // Initial greeting
        setMessages([{
            id: "welcome",
            role: "ai",
            content: AI_RESPONSES.default[0],
            time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        }]);
        setMounted(true);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    function addAIResponse(type: string) {
        setIsTyping(true);
        setTimeout(() => {
            const responses = AI_RESPONSES[type] || AI_RESPONSES.default;
            const response = responses[Math.floor(Math.random() * responses.length)];
            setMessages((prev) => [...prev, {
                id: Date.now().toString(),
                role: "ai",
                content: response,
                time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
            }]);
            setIsTyping(false);
        }, 1200);
    }

    function handleSend() {
        if (!input.trim()) return;
        setMessages((prev) => [...prev, {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        }]);
        setInput("");

        const lower = input.toLowerCase();
        let type = "default";
        if (lower.includes("concept") || lower.includes("expli") || lower.includes("c'est quoi")) type = "concept";
        else if (lower.includes("résumé") || lower.includes("resume") || lower.includes("chapitre")) type = "summary";
        else if (lower.includes("examen") || lower.includes("question") || lower.includes("exercice")) type = "exam";
        else type = "concept";

        addAIResponse(type);
    }

    function handleQuickAction(type: string, label: string) {
        setMessages((prev) => [...prev, {
            id: Date.now().toString(),
            role: "user",
            content: label,
            time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        }]);
        addAIResponse(type);
    }

    const currentCourse = courses.find((c) => c.id === selectedCourse);

    if (!mounted) return null;

    return (
        <div className="flex flex-col h-[calc(100vh-var(--spacing-topbar)-2rem)] pb-24 md:pb-0">
            {/* Header */}
            <div className="flex-shrink-0">
                <div className="flex items-center gap-3 mb-4">
                    <Link href="/academic"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Retour
                    </Link>
                </div>
                <ModuleHeader title="Tuteur IA" description="Ton tuteur intelligent pour réviser et comprendre tes cours" />

                {/* Course selector + Quick actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
                    {courses.length > 0 && (
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0" />
                            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}
                                className="px-3 py-2 border-2 border-[var(--border)] rounded-xl text-sm font-bold bg-[var(--card)] min-w-0 flex-1">
                                {courses.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
                            </select>
                        </div>
                    )}
                    <div className="flex gap-2 overflow-x-auto">
                        <button onClick={() => handleQuickAction("concept", "Explique-moi un concept")}
                            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border-2 border-[var(--border)] bg-[var(--color-studies-light)] hover:shadow-[var(--shadow-brutalist-sm)] transition-all cursor-pointer">
                            <BookOpen className="w-3.5 h-3.5" /> Concept
                        </button>
                        <button onClick={() => handleQuickAction("summary", "Fais-moi un résumé du chapitre")}
                            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border-2 border-[var(--border)] bg-purple-100 hover:shadow-[var(--shadow-brutalist-sm)] transition-all cursor-pointer">
                            <FileText className="w-3.5 h-3.5" /> Résumé
                        </button>
                        <button onClick={() => handleQuickAction("exam", "Génère des questions d'examen")}
                            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border-2 border-[var(--border)] bg-orange-100 hover:shadow-[var(--shadow-brutalist-sm)] transition-all cursor-pointer">
                            <FileQuestion className="w-3.5 h-3.5" /> Examen
                        </button>
                    </div>
                </div>

                {currentCourse && (
                    <div className="mb-4 px-3 py-2 rounded-xl bg-[var(--color-studies-light)] border-2 border-[var(--border)] inline-flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">Contexte : {currentCourse.code} — {currentCourse.name}</span>
                    </div>
                )}
            </div>

            {/* Chat Area */}
            <Card className="flex-1 flex flex-col overflow-hidden">
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] sm:max-w-[70%] ${msg.role === "user"
                                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] rounded-2xl rounded-br-md px-4 py-3"
                                    : "bg-[var(--muted)] rounded-2xl rounded-bl-md px-4 py-3"
                                }`}>
                                {msg.role === "ai" && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 rounded-lg bg-[var(--color-studies)] border border-[var(--border)] flex items-center justify-center">
                                            <Bot className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-[10px] font-bold text-[var(--muted-foreground)]">Tuteur IA • {msg.time}</span>
                                    </div>
                                )}
                                <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                                    {msg.content}
                                </div>
                                {msg.role === "user" && (
                                    <p className="text-[10px] opacity-60 mt-1 text-right">{msg.time}</p>
                                )}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-[var(--muted)] rounded-2xl rounded-bl-md px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <Bot className="w-4 h-4 animate-pulse" />
                                    <span className="text-xs text-[var(--muted-foreground)]">Le tuteur réfléchit...</span>
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--muted-foreground)] animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--muted-foreground)] animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--muted-foreground)] animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </CardContent>

                {/* Input */}
                <div className="flex-shrink-0 p-3 sm:p-4 border-t-2 border-[var(--border)]">
                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                            placeholder="Pose ta question au tuteur IA..."
                            className="flex-1 px-4 py-3 border-2 border-[var(--border)] rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--card)]" />
                        <Button type="submit" variant="studies" disabled={!input.trim()} className="px-4">
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
