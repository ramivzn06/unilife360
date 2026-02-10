"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bot, User, Send, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModuleHeader } from "@/components/shared/module-header";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const AI_RESPONSES = [
  "D'apres l'analyse de tes depenses, les sorties restaurants representent environ 25% de ton budget. Essaie de cuisiner 2-3 repas de plus par semaine, tu pourrais economiser jusqu'a 120 EUR par mois !",
  "Astuce epargne : mets en place un virement automatique de 10% de tes revenus vers un compte epargne des reception de ta bourse. C'est la methode 'payez-vous en premier'.",
  "As-tu compare les prix de ton forfait telephone ? Les operateurs proposent des offres etudiantes entre 5 et 10 EUR/mois. Un simple changement peut te faire economiser plus de 150 EUR par an.",
  "Je constate un pic de depenses en fin de mois. Essaie la methode des enveloppes : divise ton budget hebdomadaire en 4 au debut du mois. Quand une enveloppe est vide, c'est termine pour la semaine !",
  "Pour tes courses alimentaires, pense aux applis anti-gaspi comme Too Good To Go ou aux marches de fin de journee. Tu peux reduire ton budget courses de 30% facilement.",
  "Conseil : avant tout achat superieur a 30 EUR, applique la regle des 48 heures. Attends deux jours. Cette technique elimine environ 60% des achats impulsifs.",
  "Savais-tu que la plupart des banques proposent des comptes etudiants gratuits ? Verifie si ta banque actuelle te facture des frais qui pourraient etre evites.",
  "Pour optimiser ton budget transport, as-tu regarde les abonnements etudiants de ta ville ? Entre le velo en libre-service et les reductions SNCF, il y a souvent des economies significatives.",
  "Bonne pratique : cree 3 categories dans ton budget - Essentiel (loyer, nourriture, transport), Confort (sorties, loisirs) et Epargne. Vise une repartition 50/30/20.",
  "Pense aux achats groupes avec tes colocataires ! Les produits d'entretien ou les denrees non perissables en gros format reviennent beaucoup moins cher par unite.",
];

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Salut ! Je suis ton conseiller financier IA. Pose-moi tes questions sur ton budget, tes economies ou tes depenses, et je te donnerai des conseils personnalises. Comment puis-je t'aider ?",
};

export default function FinanceAdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const responseIdx = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: "user-" + Date.now(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const delay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      const aiMsg: Message = {
        id: "ai-" + Date.now(),
        role: "assistant",
        content: AI_RESPONSES[responseIdx.current % AI_RESPONSES.length],
      };
      responseIdx.current += 1;
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex-shrink-0 mb-4">
        <Link
          href="/finance"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
        <ModuleHeader title="Conseiller IA Financier" />
      </div>

      {/* Chat container */}
      <div className="flex-1 min-h-0 flex flex-col border-2 border-[var(--border)] rounded-xl shadow-[var(--shadow-brutalist)] bg-[var(--card)] overflow-hidden">
        {/* Banner */}
        <div className="flex items-center gap-2 px-4 py-3 border-b-2 border-[var(--border)] bg-[var(--color-finance-light)]">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold">
            Mode demo - les reponses sont pre-enregistrees
          </span>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={
                "flex items-start gap-3 " +
                (msg.role === "user" ? "flex-row-reverse" : "flex-row")
              }
            >
              <div
                className={
                  "flex-shrink-0 w-9 h-9 rounded-xl border-2 border-[var(--border)] shadow-[var(--shadow-brutalist-sm)] flex items-center justify-center " +
                  (msg.role === "assistant"
                    ? "bg-[var(--color-finance)]"
                    : "bg-[var(--card)]")
                }
              >
                {msg.role === "assistant" ? (
                  <Bot className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              <div
                className={
                  "max-w-[75%] px-4 py-3 rounded-xl border-2 border-[var(--border)] shadow-[var(--shadow-brutalist-sm)] text-sm leading-relaxed " +
                  (msg.role === "user"
                    ? "bg-[var(--color-finance)]"
                    : "bg-[var(--card)]")
                }
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-xl border-2 border-[var(--border)] shadow-[var(--shadow-brutalist-sm)] bg-[var(--color-finance)] flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-4 py-3 rounded-xl border-2 border-[var(--border)] shadow-[var(--shadow-brutalist-sm)] bg-[var(--card)] text-sm">
                <span className="flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.15s" }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.3s" }}>.</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex-shrink-0 flex items-center gap-2 p-4 border-t-2 border-[var(--border)]"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pose ta question financiere..."
            disabled={isTyping}
            className="flex-1"
          />
          <Button
            type="submit"
            variant="finance"
            size="icon"
            disabled={isTyping || !input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
