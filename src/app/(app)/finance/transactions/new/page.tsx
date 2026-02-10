"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleHeader } from "@/components/shared/module-header";

type TransactionType = "expense" | "income" | "withdrawal" | "purchase" | "sale";

const CATEGORIES: Record<TransactionType, string[]> = {
  expense: [
    "Loyer", "Courses", "Sorties", "Transport", "Divertissement",
    "Vetements", "Sante", "Education", "Abonnements", "Telephone",
    "Assurance", "Epargne", "Autre",
  ],
  income: [
    "Salaire", "Bourse", "Aide financiere", "Freelance", "Cadeau", "Autre",
  ],
  withdrawal: ["Retrait DAB"],
  purchase: [
    "Achat Amazon", "Achat Vinted", "Achat en ligne", "Autre",
  ],
  sale: [
    "Vente Vinted", "Vente Leboncoin", "Vente en ligne", "Autre",
  ],
};

const TYPE_OPTIONS: { value: TransactionType; label: string; color: string }[] = [
  { value: "expense", label: "Depense", color: "bg-red-300" },
  { value: "income", label: "Revenu", color: "bg-[var(--color-finance)]" },
  { value: "withdrawal", label: "Retrait", color: "bg-[var(--color-sport)]" },
  { value: "purchase", label: "Achat", color: "bg-blue-300" },
  { value: "sale", label: "Vente", color: "bg-green-300" },
];

export default function NewTransactionPage() {
  const router = useRouter();
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [merchant, setMerchant] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const categories = CATEGORIES[type];

  function handleTypeChange(newType: TransactionType) {
    setType(newType);
    setCategory("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !category) return;

    setSubmitting(true);

    const transaction = {
      id: crypto.randomUUID(),
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
      merchant,
    };

    const existing = JSON.parse(
      localStorage.getItem("unilife-transactions") || "[]"
    );
    existing.unshift(transaction);
    localStorage.setItem("unilife-transactions", JSON.stringify(existing));

    setTimeout(() => router.push("/finance"), 300);
  }

  return (
    <div>
      <Link
        href="/finance"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Link>

      <ModuleHeader
        title="Nouvelle transaction"
        description="Ajoute une depense, un revenu, un retrait, un achat ou une vente"
      />

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Type toggle */}
            <div className="space-y-2">
              <label className="text-sm font-bold block">Type</label>
              <div className="flex gap-2 flex-wrap">
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleTypeChange(opt.value)}
                    className={`flex-1 min-w-[100px] h-11 rounded-xl border-2 border-[var(--border)] text-sm font-bold transition-all duration-150 cursor-pointer ${
                      type === opt.value
                        ? `${opt.color} shadow-[var(--shadow-brutalist)]`
                        : "bg-[var(--card)] text-[var(--muted-foreground)] translate-x-[2px] translate-y-[2px]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-sm font-bold block">Montant (EUR)</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-bold block">Categorie</label>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>
                  Choisir une categorie
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
            </div>

            {/* Merchant */}
            <div className="space-y-2">
              <label className="text-sm font-bold block">
                {type === "sale" ? "Plateforme de vente" : type === "purchase" ? "Site d'achat" : "Commercant"}
              </label>
              <Input
                type="text"
                placeholder={
                  type === "sale"
                    ? "Ex: Vinted, Leboncoin, eBay..."
                    : type === "purchase"
                      ? "Ex: Amazon, Vinted, Fnac..."
                      : type === "withdrawal"
                        ? "Ex: DAB BNP, DAB Credit Agricole..."
                        : "Ex: Carrefour, Spotify, SNCF..."
                }
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-bold block">Date</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-bold block">
                Description (optionnel)
              </label>
              <Textarea
                placeholder={
                  type === "sale"
                    ? "Ex: Veste vendue sur Vinted..."
                    : type === "purchase"
                      ? "Ex: Ecouteurs Bluetooth commandes..."
                      : "Notes sur cette transaction..."
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <Link href="/finance" className="w-full sm:w-auto">
                <Button type="button" variant="outline" className="w-full">
                  Annuler
                </Button>
              </Link>
              <Button
                type="submit"
                variant="finance"
                disabled={submitting || !amount || !category}
                className="w-full sm:w-auto"
              >
                <Save className="w-4 h-4" />
                {submitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
