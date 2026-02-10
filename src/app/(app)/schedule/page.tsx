"use client";

import { useState, useEffect } from "react";
import { ModuleHeader } from "@/components/shared/module-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Plus,
  Sparkles,
  X,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  Copy,
  MessageSquare,
  Link2,
  ChevronDown,
} from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: "loisirs" | "etudes" | "sport" | "social" | "autre";
  color: string;
}

const EVENT_TYPES = [
  { value: "etudes", label: "Etudes", color: "bg-[var(--color-studies)]" },
  { value: "sport", label: "Sport", color: "bg-[var(--color-sport)]" },
  { value: "social", label: "Social", color: "bg-[var(--color-social)]" },
  { value: "loisirs", label: "Loisirs", color: "bg-blue-300" },
  { value: "autre", label: "Autre", color: "bg-gray-300" },
];

const TYPE_COLORS: Record<string, string> = {
  etudes: "bg-[var(--color-studies)]",
  sport: "bg-[var(--color-sport)]",
  social: "bg-[var(--color-social)]",
  loisirs: "bg-blue-300",
  autre: "bg-gray-300",
};

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);

const DEFAULT_EVENTS: CalendarEvent[] = [
  {
    id: "d1",
    title: "Cours de Mathematiques",
    description: "Algebre lineaire - Amphi A",
    date: getWeekDay(1),
    startTime: "08:00",
    endTime: "10:00",
    location: "Amphi A",
    type: "etudes",
    color: "bg-[var(--color-studies)]",
  },
  {
    id: "d2",
    title: "TD Informatique",
    description: "Programmation Python",
    date: getWeekDay(1),
    startTime: "14:00",
    endTime: "16:00",
    location: "Salle 204",
    type: "etudes",
    color: "bg-[var(--color-studies)]",
  },
  {
    id: "d3",
    title: "Football",
    description: "Entrainement equipe universitaire",
    date: getWeekDay(2),
    startTime: "17:00",
    endTime: "19:00",
    location: "Stade universitaire",
    type: "sport",
    color: "bg-[var(--color-sport)]",
  },
  {
    id: "d4",
    title: "Cours d'Anglais",
    description: "Business English - B2",
    date: getWeekDay(3),
    startTime: "10:00",
    endTime: "12:00",
    location: "Salle 105",
    type: "etudes",
    color: "bg-[var(--color-studies)]",
  },
  {
    id: "d5",
    title: "Soiree BDE",
    description: "Soiree a theme",
    date: getWeekDay(4),
    startTime: "20:00",
    endTime: "23:00",
    location: "Foyer etudiant",
    type: "social",
    color: "bg-[var(--color-social)]",
  },
  {
    id: "d6",
    title: "Cinema",
    description: "Film avec amis",
    date: getWeekDay(5),
    startTime: "19:00",
    endTime: "21:30",
    location: "Cinema MK2",
    type: "loisirs",
    color: "bg-blue-300",
  },
];

const AI_SUGGESTIONS = [
  {
    title: "Pause active",
    description: "30 min de marche entre tes cours. Ideal pour decompresser !",
    time: "12:30 - 13:00",
    type: "sport",
  },
  {
    title: "Session revision",
    description: "Creneau libre parfait pour reviser les maths.",
    time: "16:00 - 17:30",
    type: "etudes",
  },
  {
    title: "Yoga debutant",
    description: "Le studio propose un cours gratuit pour etudiants.",
    time: "Samedi 10:00",
    type: "sport",
  },
];

function getWeekDay(dayOffset: number): string {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1);
  monday.setDate(monday.getDate() + dayOffset);
  return monday.toISOString().slice(0, 10);
}

function getWeekDates(weekOffset: number): Date[] {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1 + weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function SchedulePage() {
  const [events, setEvents] = useState<CalendarEvent[]>(DEFAULT_EVENTS);
  const [showModal, setShowModal] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareAction, setShareAction] = useState("");
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    startTime: "09:00",
    endTime: "10:00",
    location: "",
    type: "etudes",
  });

  const weekDates = getWeekDates(weekOffset);

  useEffect(() => {
    const stored = localStorage.getItem("unilife-schedule");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setEvents([...parsed, ...DEFAULT_EVENTS]);
      } catch {
        // ignore
      }
    }
  }, []);

  function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!newEvent.title) return;

    const event: CalendarEvent = {
      id: crypto.randomUUID(),
      ...newEvent,
      type: newEvent.type as CalendarEvent["type"],
      color: TYPE_COLORS[newEvent.type] || "bg-gray-300",
    };

    const userEvents = JSON.parse(
      localStorage.getItem("unilife-schedule") || "[]"
    );
    userEvents.push(event);
    localStorage.setItem("unilife-schedule", JSON.stringify(userEvents));

    setEvents((prev) => [...prev, event]);
    setShowModal(false);
    setNewEvent({
      title: "",
      description: "",
      date: new Date().toISOString().slice(0, 10),
      startTime: "09:00",
      endTime: "10:00",
      location: "",
      type: "etudes",
    });
  }

  function getEventsForDay(dateStr: string) {
    return events.filter((ev) => ev.date === dateStr);
  }

  function handleShareSchedule() {
    const lines: string[] = [`Mon emploi du temps — ${weekLabel}`, "=".repeat(40), ""];
    DAY_LABELS.forEach((label, i) => {
      const dateStr = weekDates[i].toISOString().slice(0, 10);
      const dayEvents = getEventsForDay(dateStr);
      if (dayEvents.length === 0) return;
      const dateDisplay = weekDates[i].toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
      lines.push(`${label} ${dateDisplay} :`);
      dayEvents
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
        .forEach((ev) => { lines.push(`  ${ev.startTime}-${ev.endTime}  ${ev.title}${ev.location ? ` (${ev.location})` : ""}`); });
      lines.push("");
    });
    lines.push("Partagé via UniLife 360");
    navigator.clipboard.writeText(lines.join("\n"));
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  }

  function getEventPosition(startTime: string, endTime: string) {
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const startMinutes = (sh - 7) * 60 + sm;
    const duration = (eh - sh) * 60 + (em - sm);
    return { top: startMinutes, height: Math.max(duration, 30) };
  }

  const weekLabel = `${weekDates[0].toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} - ${weekDates[6].toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}`;

  return (
    <div>
      <ModuleHeader
        title="Emploi du temps"
        description="Ton planning de la semaine, optimise par l'IA"
      >
        <div className="flex gap-2">
          <div className="relative">
            <Button variant="outline" onClick={() => setShowShareMenu(!showShareMenu)} className="text-xs sm:text-sm">
              {shareCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {shareCopied ? shareAction : "Partager"}
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
            {showShareMenu && (
              <div className="absolute right-0 mt-2 w-56 brutalist-card bg-[var(--card)] p-1.5 z-50">
                <button
                  onClick={() => {
                    handleShareSchedule();
                    setShareAction("Copié !");
                    setShowShareMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold rounded-lg hover:bg-[var(--muted)] transition-colors text-left cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-[var(--muted-foreground)]" />
                  Copier en texte
                </button>
                <button
                  onClick={() => {
                    // Send to friend via chat - copy schedule text then redirect
                    handleShareSchedule();
                    setShareAction("Copié !");
                    setShowShareMenu(false);
                    window.location.href = "/friends";
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold rounded-lg hover:bg-[var(--muted)] transition-colors text-left cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-[var(--muted-foreground)]" />
                  Envoyer à un ami
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/share/schedule/demo`);
                    setShareCopied(true);
                    setShareAction("Lien copié !");
                    setShowShareMenu(false);
                    setTimeout(() => setShareCopied(false), 2000);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold rounded-lg hover:bg-[var(--muted)] transition-colors text-left cursor-pointer"
                >
                  <Link2 className="w-4 h-4 text-[var(--muted-foreground)]" />
                  Lien partageable
                </button>
              </div>
            )}
          </div>
          <Button variant="sport" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            Ajouter
          </Button>
        </div>
      </ModuleHeader>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <Card className="lg:col-span-3 overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {weekLabel}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setWeekOffset((w) => w - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWeekOffset(0)}
                >
                  Aujourd&apos;hui
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setWeekOffset((w) => w + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Day headers */}
                <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b-2 border-[var(--border)]">
                  <div className="p-2" />
                  {weekDates.map((date, i) => {
                    const isToday =
                      date.toISOString().slice(0, 10) ===
                      new Date().toISOString().slice(0, 10);
                    return (
                      <div
                        key={i}
                        className={`p-2 text-center border-l-2 border-[var(--border)] ${isToday ? "bg-[var(--color-sport-light)]" : ""}`}
                      >
                        <div className="text-xs font-bold text-[var(--muted-foreground)]">
                          {DAY_LABELS[i]}
                        </div>
                        <div
                          className={`text-lg font-extrabold ${isToday ? "text-[var(--color-sport)]" : ""}`}
                        >
                          {date.getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Time grid */}
                <div className="relative grid grid-cols-[60px_repeat(7,1fr)]">
                  {/* Hour labels */}
                  <div>
                    {HOURS.map((hour) => (
                      <div
                        key={hour}
                        className="h-[60px] border-b border-[var(--border)] text-xs text-[var(--muted-foreground)] font-bold px-2 pt-1"
                      >
                        {hour}:00
                      </div>
                    ))}
                  </div>

                  {/* Day columns */}
                  {weekDates.map((date, dayIdx) => {
                    const dateStr = date.toISOString().slice(0, 10);
                    const dayEvents = getEventsForDay(dateStr);

                    return (
                      <div
                        key={dayIdx}
                        className="relative border-l-2 border-[var(--border)]"
                      >
                        {HOURS.map((hour) => (
                          <div
                            key={hour}
                            className="h-[60px] border-b border-[var(--border)]"
                          />
                        ))}
                        {dayEvents.map((ev) => {
                          const pos = getEventPosition(
                            ev.startTime,
                            ev.endTime
                          );
                          return (
                            <div
                              key={ev.id}
                              className={`absolute left-1 right-1 ${ev.color} border-2 border-[var(--border)] rounded-lg px-1.5 py-1 overflow-hidden cursor-pointer shadow-[var(--shadow-brutalist-sm)]`}
                              style={{
                                top: `${pos.top}px`,
                                height: `${pos.height}px`,
                              }}
                              title={`${ev.title}\n${ev.startTime} - ${ev.endTime}\n${ev.location}`}
                            >
                              <p className="text-[10px] font-extrabold leading-tight truncate">
                                {ev.title}
                              </p>
                              <p className="text-[9px] font-medium truncate">
                                {ev.startTime} - {ev.endTime}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Suggestions Sidebar */}
        <div className="space-y-4">
          <Card module="sport">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="w-5 h-5" />
                Suggestions IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {AI_SUGGESTIONS.map((suggestion, i) => (
                <div
                  key={i}
                  className="brutalist-card p-3 bg-[var(--card)] space-y-1"
                >
                  <p className="text-sm font-extrabold">{suggestion.title}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {suggestion.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-bold text-[var(--muted-foreground)]">
                    <Clock className="w-3 h-3" />
                    {suggestion.time}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Legende</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {EVENT_TYPES.map((t) => (
                <div key={t.value} className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded border-2 border-[var(--border)] ${t.color}`}
                  />
                  <span className="text-sm font-bold">{t.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="brutalist-card p-6 w-full max-w-md bg-[var(--card)] mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold">Nouvel evenement</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-[var(--muted)] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold block">Titre</label>
                <Input
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  placeholder="Ex: Cours de maths, Yoga..."
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold block">Type</label>
                <Select
                  value={newEvent.type}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, type: e.target.value })
                  }
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold block">Date</label>
                <Input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold block">Debut</label>
                  <Input
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, startTime: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold block">Fin</label>
                  <Input
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, endTime: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold block">Lieu</label>
                <Input
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, location: e.target.value })
                  }
                  placeholder="Ex: Amphi B, Salle 204..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold block">
                  Description (optionnel)
                </label>
                <Input
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  placeholder="Notes..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" variant="sport" className="flex-1">
                  Ajouter
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
