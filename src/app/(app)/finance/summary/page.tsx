"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ModuleHeader } from "@/components/shared/module-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  BarChart3,
  Bot,
  Sparkles,
  Lightbulb,
  Target,
  ShieldCheck,
  ArrowDownLeft,
} from "lucide-react";

/* ============================================
   TYPES & DATA
   ============================================ */

interface Transaction {
  id: string;
  type: "income" | "expense" | "withdrawal" | "purchase" | "sale";
  amount: number;
  category: string;
  description: string;
  date: string;
  merchant: string;
}

const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: "t1", type: "expense", amount: 550, category: "Loyer", description: "Loyer mensuel studio", date: "2025-02-01", merchant: "Proprietaire" },
  { id: "t2", type: "expense", amount: 45.8, category: "Courses", description: "Courses alimentaires semaine", date: "2025-02-08", merchant: "Carrefour" },
  { id: "t3", type: "expense", amount: 32.5, category: "Courses", description: "Fruits, legumes, viande", date: "2025-02-03", merchant: "Lidl" },
  { id: "t4", type: "expense", amount: 5.99, category: "Abonnements", description: "Spotify Premium etudiant", date: "2025-02-01", merchant: "Spotify" },
  { id: "t5", type: "expense", amount: 40, category: "Transport", description: "Pass transport mensuel", date: "2025-02-01", merchant: "RATP" },
  { id: "t6", type: "expense", amount: 28.5, category: "Sorties", description: "Restaurant avec amis", date: "2025-02-07", merchant: "Pizza Hut" },
  { id: "t7", type: "expense", amount: 85, category: "Assurance", description: "Assurance logement + energie", date: "2025-02-01", merchant: "EDF + MAIF" },
  { id: "t8", type: "expense", amount: 15, category: "Sante", description: "Pharmacie", date: "2025-02-06", merchant: "Pharmacie Centrale" },
  { id: "t9", type: "income", amount: 567, category: "Bourse", description: "Bourse CROUS mensuelle", date: "2025-02-05", merchant: "CROUS" },
  { id: "t10", type: "income", amount: 450, category: "Salaire", description: "Job etudiant - service en salle", date: "2025-02-01", merchant: "Restaurant Le Campus" },
  { id: "t11", type: "withdrawal", amount: 60, category: "Retrait DAB", description: "Retrait distributeur", date: "2025-02-04", merchant: "DAB BNP Paribas" },
  { id: "t12", type: "withdrawal", amount: 40, category: "Retrait DAB", description: "Retrait especes", date: "2025-02-09", merchant: "DAB Credit Agricole" },
  { id: "t13", type: "purchase", amount: 24.99, category: "Achat Amazon", description: "Ecouteurs Bluetooth", date: "2025-02-02", merchant: "Amazon" },
  { id: "t14", type: "purchase", amount: 18.5, category: "Achat Vinted", description: "Pull hiver occasion", date: "2025-02-06", merchant: "Vinted" },
  { id: "t15", type: "sale", amount: 35, category: "Vente Vinted", description: "Veste en jean vendue", date: "2025-02-03", merchant: "Vinted" },
  { id: "t16", type: "sale", amount: 45, category: "Vente Leboncoin", description: "Ancien manuel scolaire lot", date: "2025-02-07", merchant: "Leboncoin" },
];

/* Simulated historical months */
const HISTORY = [
  { month: "Décembre", income: 980, expenses: 820, savings: 160 },
  { month: "Janvier", income: 1050, expenses: 890, savings: 160 },
];

const AI_ADVICE = [
  { icon: Target, title: "Objectif épargne", text: "Tu épargnes environ 6% de tes revenus. Vise 10% en réduisant tes achats en ligne de 20 €/mois.", color: "text-blue-600" },
  { icon: Lightbulb, title: "Optimise tes courses", text: "Tu fais tes courses chez 2 enseignes. Compare les prix sur les 5 produits que tu achètes le plus souvent — potentiel d'économie : ~15 €/mois.", color: "text-yellow-600" },
  { icon: ShieldCheck, title: "Assurance étudiant", text: "Ton assurance (85 €/mois) est au-dessus de la moyenne étudiante (60 €). Vérifie si tu peux passer à une formule basique.", color: "text-green-600" },
  { icon: PiggyBank, title: "Ventes en ligne", text: "Tu gagnes 80 € en ventes ce mois. Trie tes affaires et vise 2-3 ventes/semaine sur Vinted pour un complément régulier.", color: "text-purple-600" },
  { icon: TrendingDown, title: "Abonnements", text: "Tu paies Spotify (5,99 €). Vérifie si tu utilises d'autres services gratuits qui suffiraient. Chaque euro compte !", color: "text-red-600" },
];

/* ============================================
   HELPERS
   ============================================ */

function fmt(n: number): string { return n.toFixed(2).replace(".", ","); }

/* ============================================
   COMPONENT
   ============================================ */

export default function FinanceSummaryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(DEFAULT_TRANSACTIONS);

  useEffect(() => {
    const stored = localStorage.getItem("unilife-transactions");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTransactions([...parsed, ...DEFAULT_TRANSACTIONS]);
      } catch { /* ignore */ }
    }
  }, []);

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalWithdrawals = transactions.filter((t) => t.type === "withdrawal").reduce((s, t) => s + t.amount, 0);
  const totalPurchases = transactions.filter((t) => t.type === "purchase").reduce((s, t) => s + t.amount, 0);
  const totalSales = transactions.filter((t) => t.type === "sale").reduce((s, t) => s + t.amount, 0);
  const totalOut = totalExpenses + totalWithdrawals + totalPurchases;
  const totalIn = totalIncome + totalSales;
  const savingsRate = totalIn > 0 ? Math.round(((totalIn - totalOut) / totalIn) * 100) : 0;
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const avgDaily = totalOut / Math.max(1, new Date().getDate());

  // Category breakdown
  const catBreak = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, t) => { a[t.category] = (a[t.category] || 0) + t.amount; return a; }, {} as Record<string, number>);
  const sortedCats = Object.entries(catBreak)
    .sort(([, a], [, b]) => b - a)
    .map(([cat, amt]) => ({ cat, amt, pct: Math.round((amt / totalExpenses) * 100) }));

  // Current month simulated
  const currentMonth = {
    month: "Février",
    income: totalIn,
    expenses: totalOut,
    savings: totalIn - totalOut,
  };
  const allMonths = [...HISTORY, currentMonth];

  const CATEGORY_BAR_COLORS: Record<string, string> = {
    Loyer: "bg-red-400", Courses: "bg-green-400", Sorties: "bg-orange-400",
    Transport: "bg-blue-400", Abonnements: "bg-cyan-400", Assurance: "bg-amber-400",
    Sante: "bg-rose-400", Education: "bg-violet-400", Divertissement: "bg-purple-400",
  };

  return (
    <div className="pb-24 md:pb-0">
      <Link href="/finance"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" />Retour aux finances
      </Link>

      <ModuleHeader title="Bilan Financier" description="Vue d'ensemble de ta santé financière">
        <Link href="/finance/advisor">
          <Button variant="finance" className="text-xs sm:text-sm">
            <Bot className="w-4 h-4" />Conseiller IA
          </Button>
        </Link>
      </ModuleHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="Dépenses totales" value={`${fmt(totalOut)} €`} icon={TrendingDown} module="finance" />
        <StatCard label="Taux d'épargne" value={`${savingsRate} %`}
          trend={savingsRate >= 10 ? "Objectif atteint" : "Objectif : 10%"} trendUp={savingsRate >= 10} icon={PiggyBank} module="finance" />
        <StatCard label="Dépense moy./jour" value={`${fmt(avgDaily)} €`}
          trend={`sur ${daysInMonth} jours`} icon={BarChart3} module="finance" />
        <StatCard label="Revenus - Dépenses" value={`${totalIn - totalOut >= 0 ? "+" : ""}${fmt(totalIn - totalOut)} €`}
          trend={totalIn - totalOut >= 0 ? "Positif" : "Attention"} trendUp={totalIn - totalOut >= 0} icon={TrendingUp} module="finance" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Category Breakdown Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />Répartition des dépenses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedCats.map((item) => (
              <div key={item.cat} className="space-y-1">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="font-bold">{item.cat}</span>
                  <span className="font-extrabold">{fmt(item.amt)} € <span className="text-[var(--muted-foreground)] font-medium">({item.pct}%)</span></span>
                </div>
                <div className="h-3 bg-[var(--muted)] border border-[var(--border)] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${CATEGORY_BAR_COLORS[item.cat] || "bg-gray-400"}`}
                    style={{ width: `${Math.min(item.pct, 100)}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Monthly Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Historique 3 mois</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allMonths.map((m, i) => {
                const isLast = i === allMonths.length - 1;
                return (
                  <div key={m.month} className={`p-3 rounded-xl border-2 border-[var(--border)] ${isLast ? "bg-[var(--color-finance-light)]" : "bg-[var(--muted)]"}`}>
                    <p className="text-xs font-extrabold mb-2">{m.month} {isLast && <span className="text-[10px] font-bold text-[var(--muted-foreground)]">(en cours)</span>}</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-[10px] text-[var(--muted-foreground)]">Revenus</p>
                        <p className="text-xs font-extrabold text-green-700 dark:text-green-400">{fmt(m.income)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[var(--muted-foreground)]">Dépenses</p>
                        <p className="text-xs font-extrabold text-red-700 dark:text-red-400">{fmt(m.expenses)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[var(--muted-foreground)]">Épargne</p>
                        <p className={`text-xs font-extrabold ${m.savings >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>{m.savings >= 0 ? "+" : ""}{fmt(m.savings)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Advice */}
      <Card module="finance">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Sparkles className="w-5 h-5" />Conseils personnalisés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {AI_ADVICE.map((advice, i) => (
              <div key={i} className="brutalist-card p-3 sm:p-4 bg-[var(--card)] space-y-2">
                <div className="flex items-center gap-2">
                  <advice.icon className={`w-4 h-4 ${advice.color}`} />
                  <p className="text-xs font-extrabold">{advice.title}</p>
                </div>
                <p className="text-[11px] leading-relaxed text-[var(--muted-foreground)]">{advice.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <Link href="/finance/advisor" className="flex-1">
              <Button variant="default" className="w-full" size="sm">
                <Bot className="w-4 h-4" />Discuter avec le conseiller IA
              </Button>
            </Link>
            <Link href="/finance" className="flex-1">
              <Button variant="outline" className="w-full" size="sm">
                <ArrowDownLeft className="w-4 h-4" />Voir les transactions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
