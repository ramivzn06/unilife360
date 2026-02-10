import { streamText } from "ai";
import { models } from "@/lib/ai/providers";
import { createClient } from "@/lib/supabase/server";
import { financialAdvisorPrompt } from "@/lib/ai/prompts/financial-advisor";
import { financeTools } from "@/lib/ai/tools/finance-tools";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await req.json();

  // Gather context
  const [profileResult, expensesResult, incomeResult] = await Promise.all([
    supabase
      .from("financial_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(50),
    supabase
      .from("income_sources")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true),
  ]);

  const profile = profileResult.data;
  const expenses = expensesResult.data;
  const incomes = incomeResult.data;

  const systemPrompt = financialAdvisorPrompt({
    userName: user.user_metadata?.full_name,
    country: profile?.country_code,
    currency: profile?.currency_code,
    monthlyBudget: profile?.monthly_budget,
    inflationRate: profile?.inflation_rate,
    avgGroceryBasket: profile?.avg_grocery_basket,
    recentExpenses: expenses?.map((e) => ({
      amount: e.amount,
      category: e.category,
      description: e.description,
      date: e.date,
    })),
    incomeSources: incomes?.map((i) => ({
      name: i.name,
      amount: i.amount,
      recurrence: i.recurrence,
    })),
  });

  const result = streamText({
    model: models.financialAdvisor,
    system: systemPrompt,
    messages,
    tools: financeTools,
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
