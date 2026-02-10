import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import {
    Check,
    ArrowRight,
    Sparkles,
    Zap,
    Building2,
    Bot,
    Shield,
    Users,
    Crown,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tarifs",
    description:
        "Découvre les plans UniLife 360 : Gratuit, Pro avec 7 jours d'essai, et Campus pour ton université.",
};

const PLANS = [
    {
        name: "Gratuit",
        price: "0€",
        period: "/mois",
        description: "Parfait pour découvrir UniLife 360.",
        icon: Sparkles,
        color: "bg-[var(--muted)]",
        borderColor: "border-[var(--border)]",
        cta: "Commencer gratuitement",
        ctaVariant: "outline" as const,
        features: [
            "Budget de base (revenus / dépenses)",
            "Emploi du temps importé",
            "Notes de cours simples",
            "Cercles étudiants",
            "5 requêtes IA / jour",
        ],
        excluded: [
            "Synthèses IA illimitées",
            "Générateur d'examens",
            "Billetterie intégrée",
            "Support prioritaire",
        ],
    },
    {
        name: "Pro",
        price: "4,99€",
        period: "/mois",
        description: "Tout débloquer avec l'IA illimitée.",
        icon: Zap,
        color: "bg-[var(--color-finance)]",
        borderColor: "border-[var(--border)]",
        badge: "Essai gratuit 7 jours",
        cta: "Essayer gratuitement 7 jours",
        ctaVariant: "default" as const,
        popular: true,
        features: [
            "Tout le plan Gratuit",
            "IA illimitée (budget, planning, cours)",
            "Synthèses automatiques de cours",
            "Générateur d'examens personnalisé",
            "Billetterie événements campus",
            "Analyse détaillée du reste à vivre",
            "Suggestions bien-être intelligentes",
            "Support prioritaire",
        ],
        excluded: [],
    },
    {
        name: "Campus",
        price: "Sur devis",
        period: "",
        description: "Pour les universités et grandes écoles.",
        icon: Building2,
        color: "bg-[var(--color-studies)]",
        borderColor: "border-[var(--border)]",
        cta: "Contacter l'équipe",
        ctaVariant: "outline" as const,
        features: [
            "Tout le plan Pro",
            "Déploiement pour toute l'université",
            "Panel administrateur",
            "Statistiques agrégées anonymes",
            "Intégration ENT native",
            "Personnalisation aux couleurs de l'école",
            "Support dédié 24/7",
            "Formation équipe pédagogique",
        ],
        excluded: [],
    },
];

export default function PricingPage() {
    return (
        <div>
            {/* Header */}
            <section className="max-w-6xl mx-auto px-5 pt-20 pb-8">
                <ScrollReveal>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                        Des{" "}
                        <span className="inline-block bg-[var(--color-finance)] px-3 py-1 border-2 border-[var(--border)] rounded-xl shadow-[var(--shadow-brutalist)] -rotate-1">
                            Tarifs
                        </span>{" "}
                        simples
                    </h1>
                    <p className="text-lg text-[var(--muted-foreground)] font-medium max-w-xl">
                        Pas de mauvaise surprise. Commence gratuitement et passe au Pro quand tu es prêt.
                    </p>
                </ScrollReveal>
            </section>

            {/* Plans */}
            <section className="max-w-6xl mx-auto px-5 py-12">
                <div className="grid md:grid-cols-3 gap-6">
                    {PLANS.map((plan, i) => (
                        <ScrollReveal key={plan.name} delay={i * 120}>
                            <div
                                className={`relative brutalist-card p-8 h-full flex flex-col ${plan.popular ? "ring-4 ring-[var(--primary)] scale-[1.02]" : ""
                                    }`}
                            >
                                {plan.badge && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-extrabold rounded-full border-2 border-[var(--border)] shadow-[var(--shadow-brutalist-sm)] whitespace-nowrap">
                                        <Crown className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                                        {plan.badge}
                                    </div>
                                )}

                                <div className={`w-12 h-12 ${plan.color} rounded-xl border-2 border-[var(--border)] shadow-[var(--shadow-brutalist-sm)] flex items-center justify-center mb-5`}>
                                    <plan.icon className="w-6 h-6" />
                                </div>

                                <h3 className="text-xl font-extrabold mb-1">{plan.name}</h3>
                                <p className="text-sm text-[var(--muted-foreground)] mb-4">{plan.description}</p>

                                <div className="mb-6">
                                    <span className="text-4xl font-extrabold">{plan.price}</span>
                                    <span className="text-[var(--muted-foreground)] font-bold">{plan.period}</span>
                                    {plan.name === "Pro" && (
                                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                                            soit 49,90€/an (2 mois offerts)
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-3 flex-1">
                                    {plan.features.map((feature) => (
                                        <div key={feature} className="flex items-start gap-2.5">
                                            <Check className="w-4 h-4 text-[var(--color-finance)] shrink-0 mt-0.5" />
                                            <span className="text-sm font-medium">{feature}</span>
                                        </div>
                                    ))}
                                    {plan.excluded?.map((feature) => (
                                        <div key={feature} className="flex items-start gap-2.5 opacity-40">
                                            <span className="w-4 h-4 shrink-0 mt-0.5 text-center text-xs">—</span>
                                            <span className="text-sm font-medium line-through">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link href="/register" className="mt-8 block">
                                    <Button
                                        variant={plan.ctaVariant}
                                        className={`w-full ${plan.popular ? "text-base" : ""}`}
                                        size={plan.popular ? "lg" : "default"}
                                    >
                                        {plan.cta}
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </section>

            {/* Trust badges */}
            <section className="max-w-6xl mx-auto px-5 py-16">
                <ScrollReveal>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        <div className="flex items-center gap-3 justify-center">
                            <Shield className="w-5 h-5 text-[var(--color-finance)]" />
                            <span className="text-sm font-bold">Données sécurisées</span>
                        </div>
                        <div className="flex items-center gap-3 justify-center">
                            <Bot className="w-5 h-5 text-[var(--color-studies)]" />
                            <span className="text-sm font-bold">IA de pointe</span>
                        </div>
                        <div className="flex items-center gap-3 justify-center">
                            <Users className="w-5 h-5 text-[var(--color-social)]" />
                            <span className="text-sm font-bold">500+ étudiants</span>
                        </div>
                    </div>
                </ScrollReveal>
            </section>

            {/* CTA */}
            <section className="max-w-6xl mx-auto px-5 py-16">
                <ScrollReveal>
                    <div className="brutalist-card p-10 md:p-16 text-center bg-[var(--color-finance)]">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                            Commence ton essai gratuit
                        </h2>
                        <p className="text-base opacity-80 mb-8 max-w-md mx-auto font-medium">
                            7 jours pour tester toutes les fonctionnalités Pro.
                            Aucune carte bancaire requise.
                        </p>
                        <Link href="/register">
                            <Button size="lg" className="text-base">
                                Essayer gratuitement
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </ScrollReveal>
            </section>
        </div>
    );
}
