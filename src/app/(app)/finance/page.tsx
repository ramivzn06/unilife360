"use client";

import { useEffect, useState, useRef } from "react";
import { ModuleHeader } from "@/components/shared/module-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  PiggyBank,
  Plus,
  Bot,
  ArrowRight,
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingBag,
  Home,
  Bus,
  Utensils,
  Smartphone,
  HeartPulse,
  GraduationCap,
  Music,
  Shirt,
  Zap,
  Sparkles,
  CreditCard,
  Receipt,
  Store,
  Filter,
  Camera,
  Landmark,
  X,
  CheckCircle2,
  FileText,
  ScanLine,
  Building2,
  Wifi,
  Shield,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

/* ============================================
   TYPES
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

/* ============================================
   DATA
   ============================================ */

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Loyer: Home, Courses: ShoppingCart, Sorties: Utensils, Transport: Bus,
  Divertissement: Music, Vetements: Shirt, Sante: HeartPulse,
  Education: GraduationCap, Abonnements: Smartphone, Telephone: Smartphone,
  Assurance: Zap, Epargne: PiggyBank, Salaire: Wallet, Bourse: GraduationCap,
  "Aide financiere": PiggyBank, Freelance: CreditCard, Cadeau: Sparkles,
  "Retrait DAB": CreditCard, "Achat en ligne": ShoppingBag,
  "Vente Vinted": Store, "Vente Leboncoin": Store,
  "Achat Amazon": ShoppingBag, "Achat Vinted": ShoppingBag, Autre: Receipt,
};

const CATEGORY_COLORS: Record<string, string> = {
  Loyer: "bg-red-200", Courses: "bg-green-200", Sorties: "bg-orange-200",
  Transport: "bg-blue-200", Divertissement: "bg-purple-200",
  Vetements: "bg-pink-200", Sante: "bg-rose-200", Education: "bg-violet-200",
  Abonnements: "bg-cyan-200", Telephone: "bg-teal-200",
  Assurance: "bg-amber-200", Epargne: "bg-lime-200",
};

/* Brand logos for known merchants — initials with brand colors */
const MERCHANT_BRANDS: Record<string, { initials: string; bg: string; text: string }> = {
  "Carrefour": { initials: "C", bg: "bg-[#1e3a8a]", text: "text-white" },
  "Lidl": { initials: "Li", bg: "bg-[#0050aa]", text: "text-[#fff000]" },
  "Amazon": { initials: "a", bg: "bg-[#ff9900]", text: "text-black" },
  "Spotify": { initials: "S", bg: "bg-[#1db954]", text: "text-black" },
  "Vinted": { initials: "V", bg: "bg-[#09b1ba]", text: "text-white" },
  "Netflix": { initials: "N", bg: "bg-[#e50914]", text: "text-white" },
  "Leboncoin": { initials: "lbc", bg: "bg-[#ff6e14]", text: "text-white" },
  "RATP": { initials: "R", bg: "bg-[#003366]", text: "text-white" },
  "SNCF": { initials: "S", bg: "bg-[#82368c]", text: "text-white" },
  "CROUS": { initials: "CR", bg: "bg-[#e63946]", text: "text-white" },
  "Pizza Hut": { initials: "PH", bg: "bg-[#ee3124]", text: "text-white" },
  "Uber Eats": { initials: "UE", bg: "bg-[#06c167]", text: "text-black" },
  "EDF + MAIF": { initials: "E+M", bg: "bg-[#005eb8]", text: "text-white" },
  "Auchan": { initials: "A", bg: "bg-[#e21836]", text: "text-white" },
  "E.Leclerc": { initials: "E.L", bg: "bg-[#007dc3]", text: "text-white" },
  "Fnac": { initials: "Fn", bg: "bg-[#e1a500]", text: "text-black" },
  "Deliveroo": { initials: "D", bg: "bg-[#00ccbc]", text: "text-black" },
};

const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: "t1", type: "expense", amount: 550, category: "Loyer", description: "Loyer mensuel studio", date: "2025-02-01", merchant: "Proprietaire" },
  { id: "t2", type: "expense", amount: 45.8, category: "Courses", description: "Courses alimentaires semaine", date: "2025-02-08", merchant: "Carrefour" },
  { id: "t3", type: "expense", amount: 32.5, category: "Courses", description: "Fruits, legumes, viande", date: "2025-02-03", merchant: "Lidl" },
  { id: "t4", type: "expense", amount: 5.99, category: "Abonnements", description: "Spotify Premium etudiant", date: "2025-02-01", merchant: "Spotify" },
  { id: "t5", type: "expense", amount: 40, category: "Transport", description: "Pass transport mensuel", date: "2025-02-01", merchant: "RATP" },
  { id: "t6", type: "expense", amount: 15, category: "Sante", description: "Pharmacie", date: "2025-02-06", merchant: "Pharmacie Centrale" },
  { id: "t9", type: "income", amount: 567, category: "Bourse", description: "Bourse CROUS mensuelle", date: "2025-02-05", merchant: "CROUS" },
  { id: "t10", type: "income", amount: 450, category: "Salaire", description: "Job etudiant - service en salle", date: "2025-02-01", merchant: "Restaurant Le Campus" },
  { id: "t11", type: "withdrawal", amount: 40, category: "Retrait DAB", description: "Retrait distributeur", date: "2025-02-04", merchant: "DAB BNP Paribas" },
  { id: "t15", type: "sale", amount: 35, category: "Vente Vinted", description: "Veste en jean vendue", date: "2025-02-03", merchant: "Vinted" },
];

const AI_TIPS = [
  { title: "Recette avec tes courses Lidl", tip: "Avec tes legumes et viande (32,50 €), essaie un chili con carne maison : 4 portions pour ~6 €, 30 min de prep." },
  { title: "Menu etudiant de la semaine", tip: "Lun: pates bolo (2,50 €) | Mar: omelette salade (1,80 €) | Mer: riz saute legumes (2 €). Total ~10 € !" },
  { title: "Astuce anti-gaspi", tip: "Installe Too Good To Go : paniers repas a -70% pres de ton campus a 3,99 €." },
  { title: "Alerte sorties", tip: "Tes restos representent 18% de ton budget libre. Cuisiner 1 repas de plus/semaine = ~50 € economises." },
];

const BANKS = [
  { name: "BNP Paribas Fortis", color: "bg-green-100", initials: "BNP" },
  { name: "ING", color: "bg-orange-100", initials: "ING" },
  { name: "Belfius", color: "bg-purple-100", initials: "BEL" },
  { name: "KBC", color: "bg-blue-100", initials: "KBC" },
  { name: "CBC", color: "bg-blue-50", initials: "CBC" },
  { name: "Argenta", color: "bg-red-100", initials: "ARG" },
  { name: "Crédit Agricole", color: "bg-green-50", initials: "CA" },
  { name: "Société Générale", color: "bg-red-50", initials: "SG" },
  { name: "N26", color: "bg-teal-100", initials: "N26" },
  { name: "Revolut", color: "bg-violet-100", initials: "REV" },
];

/* ============================================
   HELPERS
   ============================================ */

function formatAmount(n: number): string { return n.toFixed(2).replace(".", ","); }

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Hier";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function typeLabel(t: Transaction["type"]): string {
  const m: Record<string, string> = { income: "Revenu", expense: "Depense", withdrawal: "Retrait", purchase: "Achat", sale: "Vente" };
  return m[t];
}

function typeColor(t: Transaction["type"]): string {
  if (t === "income" || t === "sale") return "text-green-700 dark:text-green-400";
  if (t === "withdrawal") return "text-orange-700 dark:text-orange-400";
  return "text-red-700 dark:text-red-400";
}

function typeIcon(t: Transaction["type"]): LucideIcon {
  const m: Record<string, LucideIcon> = { income: ArrowDownLeft, sale: ArrowDownLeft, expense: ArrowUpRight, withdrawal: CreditCard, purchase: ShoppingBag };
  return m[t];
}

function typeBadge(t: Transaction["type"]): "finance" | "destructive" | "sport" | "outline" {
  if (t === "income" || t === "sale") return "finance";
  if (t === "withdrawal") return "sport";
  return "destructive";
}

/* ============================================
   COMPONENT
   ============================================ */

type FilterType = "all" | Transaction["type"];

export default function FinanceDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>(DEFAULT_TRANSACTIONS);
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showBank, setShowBank] = useState(false);
  const [scanStep, setScanStep] = useState<"upload" | "processing" | "preview" | "done">("upload");
  const [scanData, setScanData] = useState({ merchant: "", amount: "", category: "Courses", date: new Date().toISOString().slice(0, 10) });
  const [scanImage, setScanImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const balance = totalIn - totalOut;
  const budget = 1200;
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const daysLeft = Math.max(1, daysInMonth - new Date().getDate());
  const remaining = Math.max(0, budget - totalOut);
  const dailyBudget = remaining / daysLeft;

  const catBreak = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, t) => { a[t.category] = (a[t.category] || 0) + t.amount; return a; }, {} as Record<string, number>);
  const sortedCats = Object.entries(catBreak)
    .sort(([, a], [, b]) => b - a)
    .map(([cat, amt]) => ({ cat, amt, pct: Math.round((amt / totalExpenses) * 100) }));

  const filteredTx = transactions
    .filter((t) => (filter === "all" || t.type === filter) && (!selectedCat || t.category === selectedCat))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const FILTERS: { value: FilterType; label: string; icon: LucideIcon }[] = [
    { value: "all", label: "Tout", icon: Filter },
    { value: "expense", label: "Depenses", icon: ArrowUpRight },
    { value: "income", label: "Revenus", icon: ArrowDownLeft },
    { value: "withdrawal", label: "Retraits", icon: CreditCard },
    { value: "purchase", label: "Achats", icon: ShoppingBag },
    { value: "sale", label: "Ventes", icon: Store },
  ];

  function handleScanUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      setScanImage(ev.target?.result as string);
      setScanStep("processing");

      // Try to detect merchant from file name
      const fileName = file.name.toLowerCase();
      const merchantPatterns: [RegExp, string, string][] = [
        [/carrefour/i, "Carrefour", "Courses"], [/lidl/i, "Lidl", "Courses"],
        [/auchan/i, "Auchan", "Courses"], [/leclerc/i, "E.Leclerc", "Courses"],
        [/amazon/i, "Amazon", "Achat Amazon"], [/spotify/i, "Spotify", "Abonnements"],
        [/netflix/i, "Netflix", "Abonnements"], [/uber/i, "Uber Eats", "Sorties"],
        [/sncf/i, "SNCF", "Transport"], [/ratp/i, "RATP", "Transport"],
        [/pharmacie/i, "Pharmacie", "Sante"], [/fnac/i, "Fnac", "Achat en ligne"],
        [/vinted/i, "Vinted", "Achat Vinted"], [/deliveroo/i, "Deliveroo", "Sorties"],
      ];

      let merchant = "Commerçant détecté";
      let category = "Courses";
      let amount = "";
      const date = new Date().toISOString().slice(0, 10);

      // Check file name for merchant clues
      for (const [pattern, name, cat] of merchantPatterns) {
        if (pattern.test(fileName)) {
          merchant = name; category = cat; break;
        }
      }

      // Try browser TextDetector API (Chrome only)
      let extractedText = "";
      try {
        if ("TextDetector" in window) {
          const img = new Image();
          img.src = ev.target?.result as string;
          await img.decode();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const detector = new (window as any).TextDetector();
          const texts = await detector.detect(img);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          extractedText = texts.map((t: any) => t.rawValue).join(" ");

          // Try to find merchant from extracted text
          if (merchant === "Commerçant détecté") {
            for (const [pattern, name, cat] of merchantPatterns) {
              if (pattern.test(extractedText)) {
                merchant = name; category = cat; break;
              }
            }
          }

          // Extract amount (XX,XX or XX.XX patterns)
          const amountMatch = extractedText.match(/(\d{1,4}[.,]\d{2})/);
          if (amountMatch) amount = amountMatch[1].replace(",", ".");
        }
      } catch { /* TextDetector not available, continue with filename-based detection */ }

      // Simulate processing delay for realistic feel
      setTimeout(() => {
        setScanData({ merchant, amount: amount || "", category, date });
        setScanStep("preview");
      }, 2000);
    };
    reader.readAsDataURL(file);
  }

  function handleScanConfirm() {
    const newTx: Transaction = {
      id: `scan-${Date.now()}`,
      type: "expense",
      amount: parseFloat(scanData.amount) || 0,
      category: scanData.category,
      description: `Ticket scanné - ${scanData.merchant}`,
      date: scanData.date,
      merchant: scanData.merchant,
    };
    setTransactions((prev) => [newTx, ...prev]);
    setScanStep("done");
    setTimeout(() => {
      setShowScanner(false);
      setScanStep("upload");
      setScanImage("");
      setScanData({ merchant: "", amount: "", category: "Courses", date: new Date().toISOString().slice(0, 10) });
    }, 1500);
  }

  return (
    <div className="pb-24 md:pb-0">
      <ModuleHeader title="Finance" description="Ton tableau de bord financier intelligent">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setShowScanner(true)} className="text-xs sm:text-sm">
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Scanner un ticket</span>
            <span className="sm:hidden">Scanner</span>
          </Button>
          <Button variant="outline" onClick={() => setShowBank(true)} className="text-xs sm:text-sm">
            <Landmark className="w-4 h-4" />
            <span className="hidden sm:inline">Banque</span>
          </Button>
          <Link href="/finance/transactions/new">
            <Button variant="finance" className="text-xs sm:text-sm"><Plus className="w-4 h-4" />Ajouter</Button>
          </Link>
        </div>
      </ModuleHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard label="Revenus du mois" value={`${formatAmount(totalIn)} €`}
          trend={`+${formatAmount(totalSales)} € de ventes`} trendUp icon={TrendingUp} module="finance" />
        <StatCard label="Depenses totales" value={`${formatAmount(totalOut)} €`}
          trend={`${formatAmount(totalWithdrawals)} € en retraits`} trendUp={false} icon={TrendingDown} module="finance" />
        <StatCard label="Reste a vivre" value={`${formatAmount(remaining)} €`} icon={PiggyBank} module="finance" />
        <StatCard label="Budget / jour" value={`${formatAmount(dailyBudget)} €`}
          trend={`${daysLeft} jours restants`} trendUp={dailyBudget > 5} icon={Wallet} module="finance" />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Categories */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm sm:text-base">Depenses par categorie</CardTitle>
              {selectedCat && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedCat(null)}>Effacer filtre</Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedCats.map((item) => {
                const Icon = CATEGORY_ICONS[item.cat] || Receipt;
                const bg = CATEGORY_COLORS[item.cat] || "bg-gray-200";
                const sel = selectedCat === item.cat;
                return (
                  <button key={item.cat} onClick={() => setSelectedCat(sel ? null : item.cat)}
                    className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all cursor-pointer ${sel ? "bg-[var(--color-finance-light)] border-2 border-[var(--border)]" : "hover:bg-[var(--muted)] border-2 border-transparent"
                      }`}>
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${bg} border-2 border-[var(--border)] flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs sm:text-sm font-bold">{item.cat}</span>
                        <span className="text-xs sm:text-sm font-extrabold">{formatAmount(item.amt)} &euro;</span>
                      </div>
                      <div className="h-2 sm:h-2.5 bg-[var(--muted)] border border-[var(--border)] rounded-full overflow-hidden">
                        <div className={`h-full ${bg} rounded-full`} style={{ width: `${Math.min(item.pct, 100)}%` }} />
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-[var(--muted-foreground)] w-8 sm:w-10 text-right">{item.pct}%</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-4">
          {/* AI Tips */}
          <Card module="finance">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base"><Bot className="w-5 h-5" />Conseiller IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {AI_TIPS.slice(0, 2).map((tip, i) => (
                <div key={i} className="brutalist-card p-3 bg-[var(--card)] dark:bg-[var(--card)] space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-[var(--color-finance-dark)]" />
                    <p className="text-[11px] sm:text-xs font-extrabold">{tip.title}</p>
                  </div>
                  <p className="text-[10px] sm:text-[11px] leading-relaxed text-[var(--muted-foreground)]">{tip.tip}</p>
                </div>
              ))}
              <Link href="/finance/advisor">
                <Button variant="default" className="w-full mt-2" size="sm">
                  Discuter avec l&apos;IA<ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Balance */}
          <Card>
            <CardHeader><CardTitle className="text-sm sm:text-base">Bilan du mois</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Revenus</span>
                <span className="font-bold text-green-700 dark:text-green-400">+{formatAmount(totalIn)} &euro;</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Depenses</span>
                <span className="font-bold text-red-700 dark:text-red-400">-{formatAmount(totalExpenses)} &euro;</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Retraits</span>
                <span className="font-bold text-orange-700 dark:text-orange-400">-{formatAmount(totalWithdrawals)} &euro;</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Achats en ligne</span>
                <span className="font-bold text-red-700 dark:text-red-400">-{formatAmount(totalPurchases)} &euro;</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Ventes</span>
                <span className="font-bold text-green-700 dark:text-green-400">+{formatAmount(totalSales)} &euro;</span>
              </div>
              <div className="border-t-2 border-[var(--border)] pt-2 mt-2 flex justify-between">
                <span className="font-extrabold">Solde</span>
                <span className={`font-extrabold ${balance >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                  {balance >= 0 ? "+" : ""}{formatAmount(balance)} &euro;
                </span>
              </div>
              <Link href="/finance/summary">
                <Button variant="outline" className="w-full mt-3" size="sm">
                  Bilan détaillé <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* All Transactions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm sm:text-base">Toutes les transactions</CardTitle>
              <Link href="/finance/transactions/new">
                <Button variant="ghost" size="sm"><Plus className="w-4 h-4" />Ajouter</Button>
              </Link>
            </div>
            <div className="flex gap-1.5 sm:gap-2 flex-wrap">
              {FILTERS.map((f) => (
                <button key={f.value} onClick={() => { setFilter(f.value); setSelectedCat(null); }}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold rounded-xl border-2 border-[var(--border)] transition-all cursor-pointer ${filter === f.value ? "bg-[var(--color-finance)] shadow-[var(--shadow-brutalist-sm)]" : "bg-[var(--card)] text-[var(--muted-foreground)]"
                    }`}>
                  <f.icon className="w-3 h-3" />{f.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredTx.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)] text-center py-8">Aucune transaction dans cette categorie</p>
            ) : (
              filteredTx.map((tx) => {
                const TIcon = typeIcon(tx.type);
                const CIcon = CATEGORY_ICONS[tx.category] || Receipt;
                const cBg = CATEGORY_COLORS[tx.category] || "bg-gray-200";
                return (
                  <div key={tx.id} className="flex items-center gap-2 sm:gap-3 py-2 sm:py-3 border-b-2 border-[var(--border)] last:border-0">
                    {MERCHANT_BRANDS[tx.merchant] ? (
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${MERCHANT_BRANDS[tx.merchant].bg} border-2 border-[var(--border)] flex items-center justify-center flex-shrink-0`}>
                        <span className={`text-[9px] sm:text-[10px] font-extrabold ${MERCHANT_BRANDS[tx.merchant].text}`}>{MERCHANT_BRANDS[tx.merchant].initials}</span>
                      </div>
                    ) : (
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${cBg} border-2 border-[var(--border)] flex items-center justify-center flex-shrink-0`}>
                        <CIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <p className="text-xs sm:text-sm font-bold truncate">{tx.merchant}</p>
                        <Badge variant={typeBadge(tx.type)} className="text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0">{typeLabel(tx.type)}</Badge>
                      </div>
                      <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)] truncate">{tx.category} &middot; {tx.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-xs sm:text-sm font-extrabold flex items-center gap-1 justify-end ${typeColor(tx.type)}`}>
                        <TIcon className="w-3 h-3" />
                        {tx.type === "income" || tx.type === "sale" ? "+" : "-"}{formatAmount(tx.amount)} &euro;
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-[var(--muted-foreground)]">{formatDate(tx.date)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* ====== RECEIPT SCANNER MODAL ====== */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="brutalist-card w-full sm:max-w-xl bg-[var(--background)] rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b-2 border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-finance)] border-2 border-[var(--border)] flex items-center justify-center">
                  <ScanLine className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold">Scanner un ticket</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">L&apos;IA extrait automatiquement les informations</p>
                </div>
              </div>
              <button onClick={() => { setShowScanner(false); setScanStep("upload"); setScanImage(""); setScanData({ merchant: "", amount: "", category: "Courses", date: new Date().toISOString().slice(0, 10) }); }}
                className="p-2 rounded-xl hover:bg-[var(--muted)] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {scanStep === "upload" && (
                <div className="space-y-4">
                  <button onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-[4/3] sm:aspect-video border-3 border-dashed border-[var(--border)] rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-[var(--muted)] transition-colors cursor-pointer group">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-finance-light)] border-2 border-[var(--border)] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-extrabold">Prendre une photo ou importer</p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">Ticket de caisse, facture, reçu...</p>
                    </div>
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleScanUpload} />
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 rounded-xl bg-[var(--muted)] border-2 border-[var(--border)]">
                      <Camera className="w-5 h-5 mx-auto mb-1" />
                      <p className="text-[10px] font-bold">Photo</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--muted)] border-2 border-[var(--border)]">
                      <FileText className="w-5 h-5 mx-auto mb-1" />
                      <p className="text-[10px] font-bold">PDF</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--muted)] border-2 border-[var(--border)]">
                      <Receipt className="w-5 h-5 mx-auto mb-1" />
                      <p className="text-[10px] font-bold">Recu email</p>
                    </div>
                  </div>
                </div>
              )}

              {scanStep === "processing" && (
                <div className="text-center py-12 space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-[var(--color-finance-light)] border-2 border-[var(--border)] flex items-center justify-center mx-auto animate-pulse">
                    <ScanLine className="w-10 h-10" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold">Analyse en cours...</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">L&apos;IA lit votre ticket</p>
                  </div>
                  <div className="flex justify-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-finance)] animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-[var(--color-finance)] animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 rounded-full bg-[var(--color-finance)] animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              )}

              {scanStep === "preview" && (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {scanImage && (
                      <div className="aspect-[3/4] rounded-xl border-2 border-[var(--border)] overflow-hidden bg-gray-100">
                        <img src={scanImage} alt="Ticket" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-[var(--color-finance-dark)]" />
                        <p className="text-sm font-extrabold">Données extraites par l&apos;IA</p>
                      </div>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <label className="text-xs font-bold">Marchand</label>
                          <input value={scanData.merchant} onChange={(e) => setScanData((p) => ({ ...p, merchant: e.target.value }))}
                            className="w-full px-3 py-2 border-2 border-[var(--border)] rounded-xl text-sm font-medium" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold">Montant (€)</label>
                          <input value={scanData.amount} onChange={(e) => setScanData((p) => ({ ...p, amount: e.target.value }))}
                            className="w-full px-3 py-2 border-2 border-[var(--border)] rounded-xl text-sm font-medium" type="number" step="0.01" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold">Catégorie</label>
                          <select value={scanData.category} onChange={(e) => setScanData((p) => ({ ...p, category: e.target.value }))}
                            className="w-full px-3 py-2 border-2 border-[var(--border)] rounded-xl text-sm font-medium bg-[var(--card)]">
                            {Object.keys(CATEGORY_ICONS).map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold">Date</label>
                          <input type="date" value={scanData.date} onChange={(e) => setScanData((p) => ({ ...p, date: e.target.value }))}
                            className="w-full px-3 py-2 border-2 border-[var(--border)] rounded-xl text-sm font-medium" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => { setScanStep("upload"); setScanImage(""); }}>
                      Retour
                    </Button>
                    <Button variant="finance" className="flex-1" onClick={handleScanConfirm}>
                      <CheckCircle2 className="w-4 h-4" />
                      Confirmer et ajouter
                    </Button>
                  </div>
                </div>
              )}

              {scanStep === "done" && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 border-2 border-green-400 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-lg font-extrabold">Transaction ajoutée !</p>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">Le ticket a été importé avec succès</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====== BANK CONNECTION MODAL ====== */}
      {showBank && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="brutalist-card w-full sm:max-w-lg bg-[var(--background)] rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b-2 border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 border-2 border-[var(--border)] flex items-center justify-center">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold">Connexion bancaire</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">Connecte ton compte pour un suivi automatique</p>
                </div>
              </div>
              <button onClick={() => setShowBank(false)}
                className="p-2 rounded-xl hover:bg-[var(--muted)] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-5">
              {/* Benefits */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-3 rounded-xl bg-[var(--muted)] border-2 border-[var(--border)]">
                  <Building2 className="w-5 h-5 mx-auto mb-1.5 text-blue-600" />
                  <p className="text-[10px] font-bold">Import auto</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-[var(--muted)] border-2 border-[var(--border)]">
                  <Sparkles className="w-5 h-5 mx-auto mb-1.5 text-purple-600" />
                  <p className="text-[10px] font-bold">IA catégorise</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-[var(--muted)] border-2 border-[var(--border)]">
                  <Shield className="w-5 h-5 mx-auto mb-1.5 text-green-600" />
                  <p className="text-[10px] font-bold">100% sécurisé</p>
                </div>
              </div>

              {/* Bank Grid */}
              <div>
                <p className="text-sm font-extrabold mb-3">Choisis ta banque</p>
                <div className="grid grid-cols-2 gap-2">
                  {BANKS.map((bank) => (
                    <button key={bank.name}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 border-[var(--border)] ${bank.color} hover:shadow-[var(--shadow-brutalist-sm)] transition-all cursor-pointer text-left`}>
                      <div className="w-10 h-10 rounded-lg bg-[var(--card)] border-2 border-[var(--border)] flex items-center justify-center text-xs font-extrabold flex-shrink-0">
                        {bank.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{bank.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Wifi className="w-2.5 h-2.5 text-gray-400" />
                          <span className="text-[10px] text-[var(--muted-foreground)]">Non connecté</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Security Note */}
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-extrabold text-blue-800 dark:text-blue-300">Connexion sécurisée PSD2</p>
                    <p className="text-[11px] text-blue-700/70 dark:text-blue-400/70 mt-1">
                      Nous utilisons l&apos;API PSD2 certifiée pour une connexion en lecture seule. Aucune transaction ne peut être effectuée. L&apos;IA catégorise automatiquement chaque mouvement.
                    </p>
                  </div>
                </div>
              </div>

              <Button variant="default" className="w-full" size="lg" onClick={() => setShowBank(false)}>
                <Landmark className="w-4 h-4" />
                Bientôt disponible
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
