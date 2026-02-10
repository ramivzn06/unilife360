// UniLife 360 — Index de recherche statique pour la Command Palette

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  href: string;
  category: "page" | "feature" | "action";
  module: "finance" | "studies" | "social" | "sport" | "general";
}

export const SEARCH_INDEX: SearchItem[] = [
  // ═══════════════════════════════════════
  // PAGES
  // ═══════════════════════════════════════
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Vue d'ensemble de ton activité",
    keywords: ["accueil", "home", "tableau de bord", "résumé", "overview"],
    href: "/dashboard",
    category: "page",
    module: "general",
  },
  {
    id: "finance",
    title: "Finance",
    description: "Gérer tes transactions et ton budget",
    keywords: ["argent", "budget", "dépenses", "revenus", "transactions", "compte", "solde", "loyer", "courses", "abonnement", "banque", "paiement", "facture"],
    href: "/finance",
    category: "page",
    module: "finance",
  },
  {
    id: "finance-advisor",
    title: "Conseiller Financier IA",
    description: "Parle à Finny, ton assistant budget",
    keywords: ["finny", "ia", "conseil", "budget", "aide financière", "astuce", "économie", "épargne"],
    href: "/finance/advisor",
    category: "page",
    module: "finance",
  },
  {
    id: "finance-summary",
    title: "Bilan Financier",
    description: "Résumé détaillé de tes finances",
    keywords: ["bilan", "résumé", "statistiques", "graphique", "catégories", "historique"],
    href: "/finance/summary",
    category: "page",
    module: "finance",
  },
  {
    id: "finance-new",
    title: "Nouvelle Transaction",
    description: "Ajouter une dépense ou un revenu",
    keywords: ["ajouter", "nouvelle", "dépense", "revenu", "transaction", "entrée"],
    href: "/finance/transactions/new",
    category: "page",
    module: "finance",
  },
  {
    id: "schedule",
    title: "Emploi du temps",
    description: "Ton planning de la semaine",
    keywords: ["planning", "calendrier", "cours", "horaire", "semaine", "agenda", "rendez-vous", "créneau"],
    href: "/schedule",
    category: "page",
    module: "sport",
  },
  {
    id: "academic",
    title: "Études",
    description: "Tes cours, notes et examens",
    keywords: ["cours", "études", "matière", "notes", "fiches", "programme", "semestre", "module"],
    href: "/academic",
    category: "page",
    module: "studies",
  },
  {
    id: "academic-tutor",
    title: "Tuteur IA",
    description: "Demande de l'aide au Prof IA",
    keywords: ["prof", "tuteur", "ia", "aide", "explication", "comprendre", "exercice", "question"],
    href: "/academic/tutor",
    category: "page",
    module: "studies",
  },
  {
    id: "social",
    title: "Social & Campus",
    description: "Cercles, événements et vie étudiante",
    keywords: ["cercles", "clubs", "événements", "soirée", "campus", "activité", "association", "bde"],
    href: "/social",
    category: "page",
    module: "social",
  },
  {
    id: "friends",
    title: "Amis",
    description: "Tes amis et messagerie",
    keywords: ["amis", "chat", "message", "discussion", "contact", "conversation", "parler"],
    href: "/friends",
    category: "page",
    module: "social",
  },
  {
    id: "sport",
    title: "Sport & Bien-être",
    description: "Programmes sportifs personnalisés",
    keywords: ["sport", "fitness", "musculation", "cardio", "yoga", "entraînement", "exercice", "santé", "bien-être", "gym", "salle"],
    href: "/sport",
    category: "page",
    module: "sport",
  },
  {
    id: "profile",
    title: "Mon Profil",
    description: "Modifier tes informations personnelles",
    keywords: ["profil", "photo", "avatar", "nom", "bio", "université", "filière"],
    href: "/profile",
    category: "page",
    module: "general",
  },
  {
    id: "settings",
    title: "Paramètres",
    description: "Thème, notifications et préférences",
    keywords: ["paramètres", "réglages", "thème", "mode sombre", "notifications", "couleurs", "préférences"],
    href: "/settings",
    category: "page",
    module: "general",
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Tes alertes et rappels",
    keywords: ["notifications", "alertes", "rappels", "nouveau", "mise à jour"],
    href: "/notifications",
    category: "page",
    module: "general",
  },

  // ═══════════════════════════════════════
  // FONCTIONNALITÉS
  // ═══════════════════════════════════════
  {
    id: "feat-scanner",
    title: "Scanner de tickets",
    description: "Scanne tes reçus pour les ajouter",
    keywords: ["scanner", "ticket", "reçu", "photo", "ocr", "caisse"],
    href: "/finance",
    category: "feature",
    module: "finance",
  },
  {
    id: "feat-budget",
    title: "Calcul de budget",
    description: "Ton reste à vivre et budget quotidien",
    keywords: ["budget", "reste à vivre", "quotidien", "calcul", "combien"],
    href: "/finance/summary",
    category: "feature",
    module: "finance",
  },
  {
    id: "feat-share-schedule",
    title: "Partager l'emploi du temps",
    description: "Envoie ton planning à tes amis",
    keywords: ["partager", "envoyer", "planning", "emploi du temps", "copier"],
    href: "/schedule",
    category: "feature",
    module: "sport",
  },
  {
    id: "feat-workout",
    title: "Programme sportif",
    description: "Génère un programme adapté à toi",
    keywords: ["programme", "workout", "entraînement", "générer", "personnalisé"],
    href: "/sport",
    category: "feature",
    module: "sport",
  },
  {
    id: "feat-dark-mode",
    title: "Mode sombre",
    description: "Activer ou désactiver le mode sombre",
    keywords: ["sombre", "dark", "nuit", "thème", "clair", "light"],
    href: "/settings",
    category: "feature",
    module: "general",
  },
  {
    id: "feat-colors",
    title: "Couleurs d'accent",
    description: "Personnalise les couleurs de chaque section",
    keywords: ["couleur", "accent", "personnaliser", "thème", "vert", "violet", "rose", "orange"],
    href: "/settings",
    category: "feature",
    module: "general",
  },

  // ═══════════════════════════════════════
  // ACTIONS RAPIDES
  // ═══════════════════════════════════════
  {
    id: "action-add-expense",
    title: "Ajouter une dépense",
    description: "Enregistrer une nouvelle dépense",
    keywords: ["ajouter", "dépense", "payer", "achat", "loyer", "courses"],
    href: "/finance/transactions/new",
    category: "action",
    module: "finance",
  },
  {
    id: "action-add-course",
    title: "Ajouter un cours",
    description: "Créer un nouveau cours",
    keywords: ["ajouter", "cours", "matière", "nouveau"],
    href: "/academic",
    category: "action",
    module: "studies",
  },
  {
    id: "action-ask-finny",
    title: "Parler à Finny",
    description: "Poser une question au conseiller financier",
    keywords: ["finny", "question", "demander", "ia", "conseil"],
    href: "/finance/advisor",
    category: "action",
    module: "finance",
  },
  {
    id: "action-ask-prof",
    title: "Parler au Prof",
    description: "Poser une question au tuteur IA",
    keywords: ["prof", "tuteur", "question", "aide", "comprendre"],
    href: "/academic/tutor",
    category: "action",
    module: "studies",
  },
];

/** Recherche fuzzy dans l'index */
export function searchItems(query: string): SearchItem[] {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  type Scored = SearchItem & { score: number };
  const results: Scored[] = [];

  for (const item of SEARCH_INDEX) {
    let score = 0;
    const title = item.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const desc = item.description.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Titre exact
    if (title === q) score = 100;
    // Titre commence par
    else if (title.startsWith(q)) score = 80;
    // Titre contient
    else if (title.includes(q)) score = 60;
    // Description contient
    else if (desc.includes(q)) score = 40;
    // Mot-clé match
    else {
      for (const kw of item.keywords) {
        const k = kw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (k === q) { score = 70; break; }
        if (k.startsWith(q)) { score = Math.max(score, 50); }
        if (k.includes(q)) { score = Math.max(score, 30); }
      }
    }

    if (score > 0) results.push({ ...item, score });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 8);
}
