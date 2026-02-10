"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  GraduationCap,
  Wallet,
  CheckCircle2,
  Send,
  Sparkles,
  ChevronRight,
  Search,
  Plus,
  X,
  Calendar,
} from "lucide-react";
import { searchUniversities, universityLabel, type University } from "@/lib/constants/universities";

/* ───── Types ───── */
interface CollectedData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  university: string;
  studyField: string;
  studyYear: number;
  city: string;
  country: string;
  incomes: Array<{ source: string; amount: number }>;
  fixedExpenses: Array<{ name: string; amount: number }>;
  monthlyBudget: number;
}

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
}

/* ───── Constantes ───── */
const STEPS = [
  { icon: User, label: "Identité", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  { icon: GraduationCap, label: "Études", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
  { icon: Wallet, label: "Finances", color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
  { icon: Sparkles, label: "Résumé", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  { icon: CheckCircle2, label: "Terminé", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
];

const STUDY_FIELDS = [
  "Informatique", "Droit", "Médecine", "Sciences économiques", "Ingénierie",
  "Psychologie", "Communication", "Sciences politiques", "Architecture",
  "Pharmacie", "Biologie", "Mathématiques", "Physique", "Chimie",
  "Histoire", "Philosophie", "Langues et lettres", "Sciences de l'éducation",
  "Arts", "Musique", "Kinésithérapie", "Sciences infirmières",
  "Marketing", "Gestion", "Comptabilité", "Tourisme",
];

const INCOME_SUGGESTIONS = [
  { source: "Bourse/Allocation", icon: "🎓" },
  { source: "Job étudiant", icon: "💼" },
  { source: "Aide familiale", icon: "👨‍👩‍👧" },
  { source: "CPAS/Aide sociale", icon: "🏛️" },
  { source: "Autre", icon: "💰" },
];

const EXPENSE_SUGGESTIONS = [
  { name: "Loyer", icon: "🏠" },
  { name: "Transport (abonnement)", icon: "🚌" },
  { name: "Téléphone", icon: "📱" },
  { name: "Abonnements (Spotify, Netflix...)", icon: "📺" },
  { name: "Assurance", icon: "🛡️" },
  { name: "Électricité/Gaz", icon: "⚡" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<CollectedData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    university: "",
    studyField: "",
    studyYear: 1,
    city: "",
    country: "BE",
    incomes: [],
    fixedExpenses: [],
    monthlyBudget: 0,
  });

  // Chat IA
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Université autocomplete
  const [uniQuery, setUniQuery] = useState("");
  const [uniResults, setUniResults] = useState<University[]>([]);
  const [showUniDropdown, setShowUniDropdown] = useState(false);

  // Income/expense temp
  const [tempIncome, setTempIncome] = useState({ source: "", amount: "" });
  const [tempExpense, setTempExpense] = useState({ name: "", amount: "" });

  // Scroll auto vers le dernier message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Appeler l'IA quand on change d'étape
  useEffect(() => {
    if (step === 3) {
      askAI(`Voici mes infos : je m'appelle ${data.firstName} ${data.lastName}, j'étudie ${data.studyField} à ${data.university} (année ${data.studyYear}). ${data.incomes.length > 0 ? `Mes revenus : ${data.incomes.map(i => `${i.source}: ${i.amount}€`).join(", ")}.` : ""} ${data.fixedExpenses.length > 0 ? `Mes charges fixes : ${data.fixedExpenses.map(e => `${e.name}: ${e.amount}€`).join(", ")}.` : ""} Fais-moi un résumé de mon profil avec un conseil budget et une suggestion de repas.`);
    }
  }, [step]);

  /* ───── IA Chat ───── */
  async function askAI(userMessage: string) {
    const newMessages: ChatMessage[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setAiLoading(true);

    try {
      const res = await fetch("/api/ai/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          step: step + 1,
          collectedData: data,
        }),
      });

      if (!res.ok || !res.body) {
        setMessages([...newMessages, { role: "assistant", content: "Oups, une erreur est survenue. Continue manuellement ! 😊" }]);
        setAiLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";

      setMessages([...newMessages, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiText += decoder.decode(value, { stream: true });
        setMessages([...newMessages, { role: "assistant", content: aiText }]);
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Je n'ai pas pu me connecter. Continue quand même ! 💪" }]);
    }
    setAiLoading(false);
  }

  /* ───── Handlers ───── */
  function handleUniSearch(q: string) {
    setUniQuery(q);
    if (q.length >= 2) {
      setUniResults(searchUniversities(q));
      setShowUniDropdown(true);
    } else {
      setUniResults([]);
      setShowUniDropdown(false);
    }
  }

  function selectUniversity(u: University) {
    setData((d) => ({ ...d, university: u.shortName || u.name, city: u.city, country: u.country }));
    setUniQuery(universityLabel(u));
    setShowUniDropdown(false);
  }

  function addIncome(source: string) {
    if (!tempIncome.amount && !source) return;
    const s = source || tempIncome.source;
    const a = parseFloat(tempIncome.amount) || 0;
    if (s && a > 0) {
      setData((d) => ({ ...d, incomes: [...d.incomes, { source: s, amount: a }] }));
      setTempIncome({ source: "", amount: "" });
    }
  }

  function removeIncome(idx: number) {
    setData((d) => ({ ...d, incomes: d.incomes.filter((_, i) => i !== idx) }));
  }

  function addExpense(name: string) {
    if (!tempExpense.amount && !name) return;
    const n = name || tempExpense.name;
    const a = parseFloat(tempExpense.amount) || 0;
    if (n && a > 0) {
      setData((d) => ({ ...d, fixedExpenses: [...d.fixedExpenses, { name: n, amount: a }] }));
      setTempExpense({ name: "", amount: "" });
    }
  }

  function removeExpense(idx: number) {
    setData((d) => ({ ...d, fixedExpenses: d.fixedExpenses.filter((_, i) => i !== idx) }));
  }

  async function handleComplete() {
    // Calcul budget
    const totalIncome = data.incomes.reduce((s, i) => s + i.amount, 0);
    const totalFixed = data.fixedExpenses.reduce((s, e) => s + e.amount, 0);
    const budget = totalIncome - totalFixed;

    const finalData = { ...data, monthlyBudget: budget };

    // Sauvegarder dans localStorage (mode démo)
    const profile = {
      nomComplet: `${data.firstName} ${data.lastName}`,
      email: "",
      username: data.firstName.toLowerCase().replace(/\s/g, "_"),
      universite: data.university,
      filiere: data.studyField,
      anneeEtude: `Année ${data.studyYear}`,
      dateNaissance: data.dateOfBirth,
      ville: data.city,
      pays: data.country === "BE" ? "Belgique" : "France",
      budgetMensuel: budget.toString(),
      devise: "EUR",
    };
    localStorage.setItem("unilife360-profile", JSON.stringify(profile));
    localStorage.setItem("unilife360-onboarding-completed", "true");

    // Essayer de sauvegarder dans Supabase
    try {
      const { completeOnboarding } = await import("@/actions/onboarding-actions");
      await completeOnboarding(finalData);
    } catch {
      // Mode démo — pas de Supabase
    }

    router.push("/dashboard");
  }

  function nextStep() {
    if (step < 4) setStep(step + 1);
  }

  function canProceed(): boolean {
    switch (step) {
      case 0: return data.firstName.trim().length > 0 && data.lastName.trim().length > 0;
      case 1: return data.university.trim().length > 0 && data.studyField.trim().length > 0;
      case 2: return true; // Finances optionnelles
      case 3: return true;
      default: return false;
    }
  }

  /* ───── RENDU ───── */
  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 py-4">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === step;
          const isDone = i < step;
          return (
            <div key={i} className="flex items-center gap-1 sm:gap-2">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 border-[var(--border)] flex items-center justify-center transition-all ${
                  isDone
                    ? "bg-emerald-500 text-white shadow-[var(--shadow-brutalist-sm)]"
                    : isActive
                      ? `${s.color} shadow-[var(--shadow-brutalist)]`
                      : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-4 sm:w-8 h-0.5 ${i < step ? "bg-emerald-500" : "bg-[var(--border)]"}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold">{STEPS[step].label}</h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Étape {step + 1} sur 5</p>
      </div>

      {/* ═══ STEP 0 : Identité ═══ */}
      {step === 0 && (
        <div className="space-y-4 bg-[var(--card)] rounded-xl border-2 border-[var(--border)] shadow-[var(--shadow-brutalist)] p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 border-2 border-[var(--border)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-300" />
            </div>
            <p className="text-sm font-medium text-[var(--muted-foreground)]">
              Yo ! Bienvenue sur UniLife 360 ! 🎉 Dis-moi comment tu t&apos;appelles pour commencer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider">Prénom</label>
              <input
                type="text"
                className="brutalist-input w-full"
                placeholder="Ton prénom"
                value={data.firstName}
                onChange={(e) => setData((d) => ({ ...d, firstName: e.target.value }))}
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider">Nom</label>
              <input
                type="text"
                className="brutalist-input w-full"
                placeholder="Ton nom"
                value={data.lastName}
                onChange={(e) => setData((d) => ({ ...d, lastName: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Date de naissance
            </label>
            <input
              type="date"
              className="brutalist-input w-full"
              value={data.dateOfBirth}
              onChange={(e) => setData((d) => ({ ...d, dateOfBirth: e.target.value }))}
            />
          </div>
        </div>
      )}

      {/* ═══ STEP 1 : Académique ═══ */}
      {step === 1 && (
        <div className="space-y-4 bg-[var(--card)] rounded-xl border-2 border-[var(--border)] shadow-[var(--shadow-brutalist)] p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 border-2 border-[var(--border)] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-300" />
            </div>
            <p className="text-sm font-medium text-[var(--muted-foreground)]">
              Super {data.firstName} ! 🙌 Maintenant parle-moi de tes études.
            </p>
          </div>

          {/* Université autocomplete */}
          <div className="space-y-1.5 relative">
            <label className="text-xs font-bold uppercase tracking-wider">Université / Haute École</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                className="brutalist-input w-full pl-10"
                placeholder="Tape le nom de ton école..."
                value={uniQuery}
                onChange={(e) => handleUniSearch(e.target.value)}
                onFocus={() => uniQuery.length >= 2 && setShowUniDropdown(true)}
              />
            </div>
            {showUniDropdown && uniResults.length > 0 && (
              <div className="absolute z-50 mt-1 w-full bg-[var(--card)] rounded-xl border-2 border-[var(--border)] shadow-[var(--shadow-brutalist)] max-h-60 overflow-y-auto">
                {uniResults.map((u, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-4 py-2.5 hover:bg-[var(--muted)] transition-colors border-b border-[var(--border)] last:border-b-0"
                    onClick={() => selectUniversity(u)}
                  >
                    <p className="text-sm font-bold">{u.shortName || u.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {u.name} — {u.city}, {u.country === "BE" ? "🇧🇪" : "🇫🇷"}
                    </p>
                  </button>
                ))}
              </div>
            )}
            {data.university && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ {data.university} — {data.city}
              </p>
            )}
          </div>

          {/* Filière */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider">Filière</label>
            <select
              className="brutalist-input w-full"
              value={data.studyField}
              onChange={(e) => setData((d) => ({ ...d, studyField: e.target.value }))}
            >
              <option value="">Choisis ta filière</option>
              {STUDY_FIELDS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Année */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider">Année d&apos;études</label>
            <div className="flex flex-wrap gap-2">
              {(data.country === "BE"
                ? ["Bac 1", "Bac 2", "Bac 3", "Master 1", "Master 2", "Doctorat"]
                : ["L1", "L2", "L3", "M1", "M2", "Doctorat"]
              ).map((label, i) => (
                <button
                  key={label}
                  onClick={() => setData((d) => ({ ...d, studyYear: i + 1 }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-[var(--border)] transition-all ${
                    data.studyYear === i + 1
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-brutalist-sm)]"
                      : "bg-[var(--muted)] hover:bg-[var(--secondary)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ STEP 2 : Finances ═══ */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Revenus */}
          <div className="bg-[var(--card)] rounded-xl border-2 border-[var(--border)] shadow-[var(--shadow-brutalist)] p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 border-2 border-[var(--border)] flex items-center justify-center">
                <Wallet className="w-5 h-5 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm font-bold">Tes revenus mensuels</p>
                <p className="text-xs text-[var(--muted-foreground)]">T&apos;inquiète, c&apos;est juste pour t&apos;aider à gérer ton budget ! 😊</p>
              </div>
            </div>

            {/* Sources suggérées */}
            <div className="flex flex-wrap gap-2">
              {INCOME_SUGGESTIONS.map((s) => (
                <button
                  key={s.source}
                  onClick={() => setTempIncome((t) => ({ ...t, source: s.source }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-[var(--border)] transition-all ${
                    tempIncome.source === s.source
                      ? "bg-green-100 dark:bg-green-900/40 border-green-500"
                      : "bg-[var(--muted)] hover:bg-[var(--secondary)]"
                  }`}
                >
                  {s.icon} {s.source}
                </button>
              ))}
            </div>

            {/* Montant + Ajouter */}
            {tempIncome.source && (
              <div className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-bold">{tempIncome.source}</label>
                  <div className="relative">
                    <input
                      type="number"
                      className="brutalist-input w-full pr-8"
                      placeholder="Montant"
                      value={tempIncome.amount}
                      onChange={(e) => setTempIncome((t) => ({ ...t, amount: e.target.value }))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--muted-foreground)]">€</span>
                  </div>
                </div>
                <button
                  onClick={() => addIncome("")}
                  className="h-10 px-4 rounded-xl bg-green-500 text-white font-bold text-sm border-2 border-[var(--border)] shadow-[var(--shadow-brutalist-sm)] hover:translate-y-0.5 hover:shadow-[var(--shadow-brutalist-pressed)] transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Liste des revenus ajoutés */}
            {data.incomes.length > 0 && (
              <div className="space-y-2">
                {data.incomes.map((inc, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)]">
                    <span className="text-sm font-medium">{inc.source}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">+{inc.amount}€</span>
                      <button onClick={() => removeIncome(i)} className="text-[var(--muted-foreground)] hover:text-red-500">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                <p className="text-xs font-bold text-green-600 dark:text-green-400 text-right">
                  Total revenus : {data.incomes.reduce((s, i) => s + i.amount, 0)}€/mois
                </p>
              </div>
            )}
          </div>

          {/* Dépenses fixes */}
          <div className="bg-[var(--card)] rounded-xl border-2 border-[var(--border)] shadow-[var(--shadow-brutalist)] p-5 sm:p-6 space-y-4">
            <p className="text-sm font-bold">Tes charges fixes mensuelles</p>

            <div className="flex flex-wrap gap-2">
              {EXPENSE_SUGGESTIONS.map((s) => (
                <button
                  key={s.name}
                  onClick={() => setTempExpense((t) => ({ ...t, name: s.name }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-[var(--border)] transition-all ${
                    tempExpense.name === s.name
                      ? "bg-red-100 dark:bg-red-900/40 border-red-500"
                      : "bg-[var(--muted)] hover:bg-[var(--secondary)]"
                  }`}
                >
                  {s.icon} {s.name}
                </button>
              ))}
            </div>

            {tempExpense.name && (
              <div className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-bold">{tempExpense.name}</label>
                  <div className="relative">
                    <input
                      type="number"
                      className="brutalist-input w-full pr-8"
                      placeholder="Montant"
                      value={tempExpense.amount}
                      onChange={(e) => setTempExpense((t) => ({ ...t, amount: e.target.value }))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--muted-foreground)]">€</span>
                  </div>
                </div>
                <button
                  onClick={() => addExpense("")}
                  className="h-10 px-4 rounded-xl bg-red-500 text-white font-bold text-sm border-2 border-[var(--border)] shadow-[var(--shadow-brutalist-sm)] hover:translate-y-0.5 hover:shadow-[var(--shadow-brutalist-pressed)] transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            {data.fixedExpenses.length > 0 && (
              <div className="space-y-2">
                {data.fixedExpenses.map((exp, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)]">
                    <span className="text-sm font-medium">{exp.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-red-600 dark:text-red-400">-{exp.amount}€</span>
                      <button onClick={() => removeExpense(i)} className="text-[var(--muted-foreground)] hover:text-red-500">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                <p className="text-xs font-bold text-red-600 dark:text-red-400 text-right">
                  Total charges : {data.fixedExpenses.reduce((s, e) => s + e.amount, 0)}€/mois
                </p>
              </div>
            )}

            {/* Résumé rapide */}
            {(data.incomes.length > 0 || data.fixedExpenses.length > 0) && (
              <div className="p-3 rounded-xl bg-[var(--muted)] border-2 border-dashed border-[var(--border)]">
                <p className="text-sm font-bold">
                  💰 Budget disponible estimé :{" "}
                  <span className={`${(data.incomes.reduce((s, i) => s + i.amount, 0) - data.fixedExpenses.reduce((s, e) => s + e.amount, 0)) > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {data.incomes.reduce((s, i) => s + i.amount, 0) - data.fixedExpenses.reduce((s, e) => s + e.amount, 0)}€/mois
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ STEP 3 : Résumé IA ═══ */}
      {step === 3 && (
        <div className="bg-[var(--card)] rounded-xl border-2 border-[var(--border)] shadow-[var(--shadow-brutalist)] p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 border-2 border-[var(--border)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-300" />
            </div>
            <p className="text-sm font-bold">Ton résumé personnalisé par l&apos;IA</p>
          </div>

          <div ref={chatRef} className="space-y-3 max-h-80 overflow-y-auto">
            {messages.filter(m => m.role === "assistant").map((m, i) => (
              <div key={i} className="p-3 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</p>
              </div>
            ))}
            {aiLoading && (
              <div className="flex items-center gap-2 p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-xs text-[var(--muted-foreground)]">L&apos;IA prépare ton résumé...</span>
              </div>
            )}
          </div>

          {/* Profil résumé sous forme de cartes */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">Identité</p>
              <p className="text-sm font-bold mt-1">{data.firstName} {data.lastName}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <p className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">Études</p>
              <p className="text-sm font-bold mt-1">{data.studyField}</p>
              <p className="text-xs text-[var(--muted-foreground)]">{data.university}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-[10px] uppercase font-bold text-green-600 dark:text-green-400">Revenus</p>
              <p className="text-sm font-bold mt-1">{data.incomes.reduce((s, i) => s + i.amount, 0)}€/mois</p>
            </div>
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400">Charges fixes</p>
              <p className="text-sm font-bold mt-1">{data.fixedExpenses.reduce((s, e) => s + e.amount, 0)}€/mois</p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ STEP 4 : Terminé ═══ */}
      {step === 4 && (
        <div className="bg-[var(--card)] rounded-xl border-2 border-[var(--border)] shadow-[var(--shadow-brutalist)] p-6 sm:p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 border-2 border-[var(--border)] shadow-[var(--shadow-brutalist)] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-xl font-extrabold">Ton profil est prêt ! 🎉</h3>
          <p className="text-sm text-[var(--muted-foreground)] max-w-md mx-auto">
            Bienvenue sur UniLife 360, {data.firstName} ! Tu peux maintenant explorer toutes les fonctionnalités :
            gestion de budget, emploi du temps, conseiller IA, et bien plus.
          </p>
          <button
            onClick={handleComplete}
            className="px-8 py-3 rounded-xl bg-emerald-500 text-white font-bold text-base border-2 border-[var(--border)] shadow-[var(--shadow-brutalist)] hover:translate-y-0.5 hover:shadow-[var(--shadow-brutalist-pressed)] transition-all"
          >
            Explorer UniLife 360 🚀
          </button>
        </div>
      )}

      {/* Bouton Continuer */}
      {step < 4 && (
        <div className="flex justify-end">
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm border-2 border-[var(--border)] transition-all ${
              canProceed()
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-brutalist)] hover:translate-y-0.5 hover:shadow-[var(--shadow-brutalist-pressed)]"
                : "bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed opacity-50"
            }`}
          >
            {step === 3 ? "Finaliser" : "Continuer"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
