import { tool } from "ai";
import { z } from "zod";

export const financeTools = {
  calculateTrueRemainingBudget: tool({
    description:
      "Calcule le Vrai Reste a Vivre apres deduction des charges fixes et des couts essentiels estimes",
    inputSchema: z.object({
      monthlyBudget: z.number().describe("Budget mensuel total"),
      fixedCharges: z
        .array(z.object({ name: z.string(), amount: z.number() }))
        .describe("Liste des charges fixes"),
      estimatedGroceryWeekly: z
        .number()
        .describe("Cout hebdomadaire estime des courses"),
      estimatedEnergyCost: z
        .number()
        .describe("Cout mensuel estime de l'energie"),
      currentSpending: z
        .number()
        .describe("Depenses actuelles du mois (hors charges fixes)"),
      daysRemainingInMonth: z
        .number()
        .describe("Nombre de jours restants dans le mois"),
    }),
    execute: async (params) => {
      const totalFixed = params.fixedCharges.reduce(
        (sum, c) => sum + c.amount,
        0
      );
      const monthlyGrocery = params.estimatedGroceryWeekly * 4.33;
      const essentialCosts =
        totalFixed + monthlyGrocery + params.estimatedEnergyCost;
      const trueRemaining =
        params.monthlyBudget - essentialCosts - params.currentSpending;
      const dailyBudget =
        params.daysRemainingInMonth > 0
          ? trueRemaining / params.daysRemainingInMonth
          : 0;

      return {
        trueRemaining: Math.round(trueRemaining * 100) / 100,
        dailyBudget: Math.round(dailyBudget * 100) / 100,
        essentialCosts: Math.round(essentialCosts * 100) / 100,
        totalFixed: Math.round(totalFixed * 100) / 100,
        monthlyGrocery: Math.round(monthlyGrocery * 100) / 100,
      };
    },
  }),

  lookupLocalPrices: tool({
    description:
      "Recherche les prix moyens locaux pour des produits courants dans le pays de l'etudiant",
    inputSchema: z.object({
      countryCode: z.string().describe("Code pays ISO 3166-1 alpha-2"),
      items: z.array(z.string()).describe("Liste des produits a rechercher"),
    }),
    execute: async (params) => {
      const priceMap: Record<string, Record<string, number>> = {
        FR: {
          pates: 1.2,
          riz: 1.5,
          lait: 1.1,
          pain: 1.3,
          oeufs: 3.2,
          poulet: 7.5,
          tomates: 2.8,
          pommes: 2.5,
          fromage: 8.5,
          cafe: 5.0,
        },
      };

      const country = priceMap[params.countryCode] || priceMap["FR"];
      return {
        country: params.countryCode,
        prices: params.items.map((item) => ({
          item,
          avgPrice: country[item.toLowerCase()] || null,
          currency: "EUR",
          trend: "stable" as const,
        })),
      };
    },
  }),

  analyzePurchaseDecision: tool({
    description:
      "Analyse si un achat est raisonnable par rapport au budget restant",
    inputSchema: z.object({
      itemDescription: z.string().describe("Description de l'achat envisage"),
      estimatedPrice: z.number().describe("Prix estime de l'achat"),
      currentBudgetRemaining: z.number().describe("Budget restant actuel"),
      category: z.string().describe("Categorie de la depense"),
    }),
    execute: async (params) => {
      const affordabilityRatio =
        params.currentBudgetRemaining > 0
          ? params.estimatedPrice / params.currentBudgetRemaining
          : 1;

      let recommendation: string;
      let emoji: string;

      if (affordabilityRatio > 0.5) {
        recommendation = "deconseille";
        emoji = "alert";
      } else if (affordabilityRatio > 0.25) {
        recommendation = "a_reflechir";
        emoji = "warning";
      } else {
        recommendation = "ok";
        emoji = "check";
      }

      return {
        affordabilityRatio: Math.round(affordabilityRatio * 100),
        recommendation,
        emoji,
        budgetImpact: `${Math.round(affordabilityRatio * 100)}% du budget restant`,
        remainingAfterPurchase:
          Math.round(
            (params.currentBudgetRemaining - params.estimatedPrice) * 100
          ) / 100,
      };
    },
  }),
};
