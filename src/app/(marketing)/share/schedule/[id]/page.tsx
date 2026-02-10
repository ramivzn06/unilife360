import Link from "next/link";
import { Calendar, Clock, MapPin, Sparkles } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

// Demo schedule data for public view
const DEMO_SCHEDULE = [
  { day: "Lundi", events: [
    { title: "Cours de Mathematiques", time: "08:00 - 10:00", location: "Amphi A", type: "etudes" },
    { title: "TD Informatique", time: "14:00 - 16:00", location: "Salle 204", type: "etudes" },
  ]},
  { day: "Mardi", events: [
    { title: "Football", time: "17:00 - 19:00", location: "Stade universitaire", type: "sport" },
  ]},
  { day: "Mercredi", events: [
    { title: "Cours d'Anglais", time: "10:00 - 12:00", location: "Salle 105", type: "etudes" },
  ]},
  { day: "Jeudi", events: [
    { title: "Soiree BDE", time: "20:00 - 23:00", location: "Foyer etudiant", type: "social" },
  ]},
  { day: "Vendredi", events: [
    { title: "Cinema", time: "19:00 - 21:30", location: "Cinema MK2", type: "loisirs" },
  ]},
];

const TYPE_COLORS: Record<string, string> = {
  etudes: "bg-[var(--color-studies)]",
  sport: "bg-[var(--color-sport)]",
  social: "bg-[var(--color-social)]",
  loisirs: "bg-blue-300",
};

export default async function SharedSchedulePage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="brutalist-card p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full border-2 border-[var(--border)] bg-[var(--color-sport)] flex items-center justify-center text-sm font-extrabold shadow-[var(--shadow-brutalist-sm)]">
              RD
            </div>
            <div>
              <h1 className="text-lg font-extrabold">Emploi du temps</h1>
              <p className="text-xs text-[var(--muted-foreground)]">Partage par Rami Demo · {id}</p>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            {DEMO_SCHEDULE.map((day) => (
              <div key={day.day}>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--muted-foreground)] mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  {day.day}
                </p>
                <div className="space-y-2">
                  {day.events.map((event, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-3 rounded-xl border-2 border-[var(--border)] ${TYPE_COLORS[event.type] || "bg-gray-100"}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-extrabold">{event.title}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-[var(--foreground)]/70">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.time}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 pt-6 border-t-2 border-dashed border-[var(--border)] text-center">
            <p className="text-sm font-bold text-[var(--muted-foreground)] mb-4">
              Rejoins UniLife 360 pour creer et partager ton emploi du temps !
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 h-11 px-6 font-bold text-sm border-2 border-[var(--border)] rounded-xl shadow-[var(--shadow-brutalist)] bg-[var(--primary)] text-[var(--primary-foreground)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
            >
              Creer mon compte
            </Link>
          </div>
        </div>

        {/* Branding */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <Sparkles className="w-4 h-4 text-[var(--primary)]" />
          <p className="text-xs font-bold text-[var(--muted-foreground)]">
            UniLife 360 — Ta vie etudiante, simplifiee
          </p>
        </div>
      </div>
    </div>
  );
}
