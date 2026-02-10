import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  Calendar,
  GraduationCap,
  Users,
  ArrowRight,
  Brain,
  Globe,
  ShieldCheck,
  BarChart3,
  BookOpen,
  Music,
  Ticket,
} from "lucide-react";

const MODULES = [
  {
    icon: Wallet,
    title: "Finance Intelligente",
    subtitle: "Module A",
    color: "bg-[var(--color-finance)]",
    features: [
      {
        icon: Globe,
        title: "Contexte géolocalisé",
        description:
          "Détection automatique de ton pays pour adapter les prix locaux, l'inflation et le coût de la vie.",
      },
      {
        icon: BarChart3,
        title: "Vrai Reste à Vivre",
        description:
          "Calcul intelligent qui déduit charges fixes, courses et énergie pour te donner ton vrai budget disponible.",
      },
      {
        icon: Brain,
        title: "Conseiller IA",
        description:
          "Un chatbot financier qui connaît ta situation et te guide pour chaque décision d'achat.",
      },
    ],
  },
  {
    icon: Calendar,
    title: "Planning & Bien-etre",
    subtitle: "Module B",
    color: "bg-[var(--color-sport)]",
    features: [
      {
        icon: Calendar,
        title: "Import ICS / CalDAV",
        description:
          "Importe ton emploi du temps depuis ENT, Google Calendar ou Apple Calendar en un clic.",
      },
      {
        icon: Music,
        title: "Suggestions bien-être",
        description:
          "L'IA détecte tes créneaux libres et te propose sport, musique, méditation ou sorties.",
      },
      {
        icon: ShieldCheck,
        title: "Équilibre de vie",
        description:
          "Alerte si tu enchaînes trop de cours sans pause. Ton bien-être mental compte.",
      },
    ],
  },
  {
    icon: GraduationCap,
    title: "Hub Académique",
    subtitle: "Module C",
    color: "bg-[var(--color-studies)]",
    features: [
      {
        icon: BookOpen,
        title: "Notes collaboratives",
        description:
          "Éditeur riche avec partage par université. Tes camarades peuvent contribuer.",
      },
      {
        icon: Brain,
        title: "Synthèses IA",
        description:
          "Résumé automatique de tes notes de cours en fiches claires et structurées.",
      },
      {
        icon: ShieldCheck,
        title: "Générateur d'examens",
        description:
          "L'IA croise tes notes avec les annales pour générer des sujets d'entraînement.",
      },
    ],
  },
  {
    icon: Users,
    title: "Vie Sociale",
    subtitle: "Module D",
    color: "bg-[var(--color-social)]",
    features: [
      {
        icon: Users,
        title: "Cercles étudiants",
        description:
          "Crée ou rejoins des groupes par université, filière ou centre d'intérêt.",
      },
      {
        icon: Calendar,
        title: "Événements campus",
        description:
          "Découvre les soirées, conférences et activités organisées par les cercles.",
      },
      {
        icon: Ticket,
        title: "Billetterie intégrée",
        description:
          "Réserve et paie tes places directement depuis l'app. QR code inclus.",
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 pt-20 pb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          Tout ce dont tu as besoin.
          <br />
          <span className="inline-block bg-[var(--color-studies)] px-3 py-1 border-2 border-[var(--border)] rounded-xl shadow-[var(--shadow-brutalist)] -rotate-1 mt-2">
            Rien de superflu.
          </span>
        </h1>
        <p className="text-lg text-[var(--muted-foreground)] font-medium max-w-xl mt-6">
          4 modules interconnectés, propulsés par l&apos;IA, pour gérer ta vie
          étudiante sans prise de tête.
        </p>
      </section>

      {/* Modules */}
      {MODULES.map((mod, idx) => (
        <section key={mod.title} className="max-w-6xl mx-auto px-5 py-12">
          <div
            className={`${mod.color} border-2 border-[var(--border)] rounded-xl shadow-[var(--shadow-brutalist)] p-8 md:p-12`}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-xl bg-white/60 border-2 border-[var(--border)] shadow-[var(--shadow-brutalist-sm)] flex items-center justify-center">
                <mod.icon className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                  {mod.subtitle}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold">
                  {mod.title}
                </h2>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {mod.features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white/50 border-2 border-[var(--border)] rounded-xl p-6 shadow-[var(--shadow-brutalist-sm)]"
                >
                  <div className="w-10 h-10 rounded-lg bg-white border-2 border-[var(--border)] flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold mb-2">{feature.title}</h3>
                  <p className="text-sm opacity-70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="brutalist-card p-10 md:p-16 text-center bg-[var(--primary)] text-[var(--primary-foreground)]">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-[var(--primary-foreground)]">
            Convaincu ?
          </h2>
          <p className="text-lg opacity-80 mb-8 max-w-md mx-auto">
            Crée ton compte en 30 secondes et découvre tout ça par toi-même.
          </p>
          <Link href="/register">
            <Button
              variant="outline"
              size="lg"
              className="text-base bg-[var(--primary-foreground)] text-[var(--primary)]"
            >
              Commencer gratuitement
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
