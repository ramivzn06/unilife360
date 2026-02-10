import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  Calendar,
  GraduationCap,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle,
  UserPlus,
  Settings2,
  Rocket,
  ChevronDown,
  Star,
  MessageCircle,
  Zap,
  Bot,
  Shield,
} from "lucide-react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

const FEATURES = [
  {
    icon: Wallet,
    title: "Finance Intelligente",
    description:
      "L'IA analyse ton budget en temps réel, détecte les prix locaux et calcule ton vrai reste à vivre.",
    color: "bg-[var(--color-finance)]",
  },
  {
    icon: Calendar,
    title: "Planning & Bien-être",
    description:
      "Importe ton emploi du temps et laisse l'IA te proposer des créneaux sport, musique ou détente.",
    color: "bg-[var(--color-sport)]",
  },
  {
    icon: GraduationCap,
    title: "Hub Académique",
    description:
      "Notes collaboratives, synthèses automatiques et générateur d'examens propulsé par l'IA.",
    color: "bg-[var(--color-studies)]",
  },
  {
    icon: Users,
    title: "Vie Sociale",
    description:
      "Cercles étudiants, événements campus et billetterie intégrée pour ne rien rater.",
    color: "bg-[var(--color-social)]",
  },
];

const STEPS = [
  {
    icon: UserPlus,
    step: "01",
    title: "Crée ton compte",
    description: "Inscris-toi en 30 secondes avec ton email ou tes réseaux sociaux.",
    color: "bg-[var(--color-finance)]",
  },
  {
    icon: Settings2,
    step: "02",
    title: "Configure tes modules",
    description: "Importe ton emploi du temps, définis ton budget et connecte tes réseaux.",
    color: "bg-[var(--color-sport)]",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Profite de l'IA",
    description: "L'IA s'adapte à ton mode de vie et t'accompagne au quotidien.",
    color: "bg-[var(--color-studies)]",
  },
];

const STATS = [
  { value: "500+", label: "Étudiants actifs" },
  { value: "4", label: "Modules intégrés" },
  { value: "100%", label: "Gratuit au départ" },
  { value: "24/7", label: "IA disponible" },
];

const TESTIMONIALS = [
  {
    name: "Sophie Martin",
    university: "Université de Bruxelles",
    quote: "UniLife 360 a changé ma façon de gérer mon budget. Je sais enfin combien je peux dépenser chaque jour !",
    color: "bg-[var(--color-finance)]",
    initials: "SM",
  },
  {
    name: "Karim Benali",
    university: "UCLouvain",
    quote: "Le planning intelligent m'a aidé à trouver du temps pour le sport. Je me sens beaucoup mieux depuis.",
    color: "bg-[var(--color-sport)]",
    initials: "KB",
  },
  {
    name: "Marie Duval",
    university: "EPHEC",
    quote: "Les synthèses IA de mes cours sont incroyables. J'ai gagné un temps fou pour mes révisions.",
    color: "bg-[var(--color-studies)]",
    initials: "MD",
  },
];

const FAQS = [
  {
    question: "UniLife 360 est-il vraiment gratuit ?",
    answer: "Oui ! Le plan Gratuit donne accès aux fonctionnalités de base. Le plan Pro (avec IA illimitée) offre un essai gratuit de 7 jours.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Absolument. Nous utilisons Supabase pour le stockage sécurisé avec chiffrement de bout en bout. Tes données restent les tiennes.",
  },
  {
    question: "Puis-je importer mon emploi du temps depuis Google Calendar ?",
    answer: "Oui, tu peux importer depuis Google Calendar, Apple Calendar, et les fichiers ICS de ton ENT universitaire.",
  },
  {
    question: "L'IA a-t-elle accès à mes données bancaires ?",
    answer: "Non. Tu saisis toi-même tes revenus et dépenses. L'IA analyse uniquement ce que tu partages pour te donner des conseils personnalisés.",
  },
  {
    question: "Comment fonctionne l'essai gratuit de 7 jours ?",
    answer: "Inscris-toi et tu auras accès à toutes les fonctionnalités Pro pendant 7 jours. Aucune carte bancaire requise. Après, tu repasses sur le plan Gratuit si tu ne souscris pas.",
  },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 pt-20 pb-16">
        <div className="max-w-3xl">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[var(--border)] rounded-xl bg-[var(--color-finance)] shadow-[var(--shadow-brutalist-sm)] mb-8">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-bold">Propulsé par l&apos;IA</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
              Ton OS de Vie
              <br />
              <span className="inline-block bg-[var(--color-finance)] px-3 py-1 border-2 border-[var(--border)] rounded-xl shadow-[var(--shadow-brutalist)] -rotate-1">
                Étudiant
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-lg md:text-xl text-[var(--muted-foreground)] font-medium max-w-xl mb-10">
              Budget intelligent, emploi du temps optimisé, cours collaboratifs et
              vie sociale — tout dans une seule app conçue pour les étudiants.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="text-base">
                  Commencer gratuitement
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" size="lg" className="text-base">
                  Découvrir les fonctionnalités
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-6xl mx-auto px-5 py-8">
        <ScrollReveal>
          <div className="brutalist-card p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-extrabold mb-1">{stat.value}</p>
                  <p className="text-sm font-bold text-[var(--muted-foreground)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-12">
            4 modules. 1 seule app.
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 100}>
              <div
                className={`${feature.color} border-2 border-[var(--border)] rounded-xl shadow-[var(--shadow-brutalist)] p-8 transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[var(--shadow-brutalist-pressed)] h-full`}
              >
                <div className="w-14 h-14 rounded-xl bg-white/60 border-2 border-[var(--border)] shadow-[var(--shadow-brutalist-sm)] flex items-center justify-center mb-5">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold mb-2">{feature.title}</h3>
                <p className="text-sm font-medium opacity-80">
                  {feature.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-[var(--muted-foreground)] font-medium mb-12 max-w-xl">
            3 étapes simples pour transformer ton quotidien étudiant.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <ScrollReveal key={step.step} delay={i * 150}>
              <div className="brutalist-card p-8 h-full">
                <div className={`w-12 h-12 ${step.color} rounded-xl border-2 border-[var(--border)] shadow-[var(--shadow-brutalist-sm)] flex items-center justify-center mb-5`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--muted-foreground)] mb-2 block">
                  Étape {step.step}
                </span>
                <h3 className="text-xl font-extrabold mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] font-medium">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Ce que disent les étudiants
          </h2>
          <p className="text-lg text-[var(--muted-foreground)] font-medium mb-12 max-w-xl">
            Des centaines d&apos;étudiants utilisent déjà UniLife 360.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 100}>
              <div className="brutalist-card p-8 h-full flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[var(--color-sport)] text-[var(--color-sport)]" />
                  ))}
                </div>
                <p className="text-sm font-medium text-[var(--foreground)] mb-6 flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t-2 border-[var(--border)]">
                  <div className={`w-10 h-10 ${t.color} rounded-xl border-2 border-[var(--border)] flex items-center justify-center`}>
                    <span className="text-xs font-extrabold">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-extrabold">{t.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{t.university}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-12">
            Questions fréquentes
          </h2>
        </ScrollReveal>

        <div className="max-w-3xl space-y-4">
          {FAQS.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <details className="group brutalist-card p-0 overflow-hidden" open={i === 0}>
                <summary className="flex items-center justify-between p-6 cursor-pointer font-extrabold text-base hover:bg-[var(--muted)] transition-colors list-none">
                  {faq.question}
                  <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180 shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6 text-sm text-[var(--muted-foreground)] font-medium leading-relaxed border-t-2 border-[var(--border)] pt-4">
                  {faq.answer}
                </div>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <ScrollReveal>
          <div className="brutalist-card p-10 md:p-16 text-center bg-[var(--primary)] text-[var(--primary-foreground)]">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[var(--primary-foreground)]">
              Prêt à reprendre le contrôle ?
            </h2>
            <p className="text-lg opacity-80 mb-8 max-w-lg mx-auto">
              Rejoins des milliers d&apos;étudiants qui ont déjà transformé leur
              quotidien avec UniLife 360.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base bg-[var(--primary-foreground)] text-[var(--primary)]"
                >
                  Créer mon compte
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base border-[var(--primary-foreground)] text-[var(--primary-foreground)] hover:bg-[var(--primary-foreground)] hover:text-[var(--primary)]"
                >
                  Voir les tarifs
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
