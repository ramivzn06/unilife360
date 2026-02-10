"use server";

import { createClient } from "@/lib/supabase/server";

export interface OnboardingData {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  university: string;
  studyField: string;
  studyYear: number;
  city?: string;
  country?: string;
  incomes?: Array<{ source: string; amount: number }>;
  fixedExpenses?: Array<{ name: string; amount: number }>;
  monthlyBudget?: number;
}

export async function completeOnboarding(data: OnboardingData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Non authentifié" };
  }

  // Mise à jour du profil utilisateur
  const { error: userError } = await supabase
    .from("users")
    .update({
      full_name: `${data.firstName} ${data.lastName}`,
      university: data.university,
      study_field: data.studyField,
      study_year: data.studyYear,
      date_of_birth: data.dateOfBirth || null,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  if (userError) {
    return { error: userError.message };
  }

  // Calcul du budget mensuel
  const totalIncome = (data.incomes || []).reduce((s, i) => s + i.amount, 0);
  const totalFixed = (data.fixedExpenses || []).reduce((s, e) => s + e.amount, 0);
  const monthlyBudget = data.monthlyBudget || totalIncome - totalFixed;

  // Création du profil financier
  const { error: financeError } = await supabase.from("financial_profiles").upsert(
    {
      user_id: user.id,
      country_code: data.country || "BE",
      city: data.city || null,
      currency_code: "EUR",
      monthly_budget: monthlyBudget > 0 ? monthlyBudget : null,
    },
    { onConflict: "user_id" }
  );

  if (financeError) {
    return { error: financeError.message };
  }

  // Création des sources de revenus
  if (data.incomes && data.incomes.length > 0) {
    const incomeRows = data.incomes.map((i) => ({
      user_id: user.id,
      name: i.source,
      amount: i.amount,
      category: i.source.toLowerCase().includes("bourse")
        ? "scholarship"
        : i.source.toLowerCase().includes("job") ||
            i.source.toLowerCase().includes("travail")
          ? "freelance"
          : i.source.toLowerCase().includes("famille") ||
              i.source.toLowerCase().includes("parent")
            ? "gift"
            : "other_income",
      recurrence: "monthly" as const,
      is_active: true,
    }));

    await supabase.from("income_sources").insert(incomeRows);
  }

  return { success: true };
}
