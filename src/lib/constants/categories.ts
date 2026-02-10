export const INCOME_CATEGORIES = [
  { value: "salary", label: "Salaire", icon: "Briefcase" },
  { value: "scholarship", label: "Bourse", icon: "GraduationCap" },
  { value: "financial_aid", label: "Aide financiere", icon: "HandCoins" },
  { value: "freelance", label: "Freelance", icon: "Laptop" },
  { value: "gift", label: "Don / Cadeau", icon: "Gift" },
  { value: "other_income", label: "Autre revenu", icon: "Plus" },
] as const;

export const EXPENSE_CATEGORIES = [
  { value: "rent", label: "Loyer", icon: "Home" },
  { value: "utilities", label: "Charges", icon: "Zap" },
  { value: "groceries", label: "Courses", icon: "ShoppingCart" },
  { value: "eating_out", label: "Restaurants", icon: "UtensilsCrossed" },
  { value: "transport", label: "Transport", icon: "Bus" },
  { value: "entertainment", label: "Loisirs", icon: "Gamepad2" },
  { value: "clothing", label: "Vetements", icon: "Shirt" },
  { value: "health", label: "Sante", icon: "Heart" },
  { value: "education", label: "Education", icon: "BookOpen" },
  { value: "subscriptions", label: "Abonnements", icon: "CreditCard" },
  { value: "phone", label: "Telephone", icon: "Smartphone" },
  { value: "insurance", label: "Assurance", icon: "Shield" },
  { value: "savings", label: "Epargne", icon: "PiggyBank" },
  { value: "other_expense", label: "Autre depense", icon: "MoreHorizontal" },
] as const;

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
