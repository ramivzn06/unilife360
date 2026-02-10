"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ModuleHeader } from "@/components/shared/module-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  MapPin,
  Ticket,
  Star,
  Globe,
  GraduationCap,
  Heart,
  Plus,
  MessageSquare,
  Phone,
} from "lucide-react";

interface CampusEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees: number;
  maxAttendees: number;
  price: string;
  tags: string[];
  type: "campus" | "local";
  contact?: { type: "whatsapp" | "instagram" | "unilife"; value: string };
}

interface Circle {
  id: string;
  name: string;
  members: number;
  description: string;
  tags: string[];
}

const DEFAULT_CIRCLES: Circle[] = [
  { id: "c1", name: "BDE Informatique", members: 156, description: "Le Bureau des Étudiants en Info", tags: ["Tech", "Soirées"] },
  { id: "c2", name: "Club Sport", members: 89, description: "Tous les sports universitaires", tags: ["Sport", "Santé"] },
  { id: "c3", name: "Asso Cinémaddict", members: 43, description: "Projections et débats ciné", tags: ["Culture", "Sorties"] },
  { id: "c4", name: "Entr'étudiants", members: 67, description: "Entraide et soutien entre étudiants", tags: ["Entraide", "Social"] },
];

const CAMPUS_EVENTS: CampusEvent[] = [
  { id: "e1", title: "Soirée d'intégration BDE", description: "Grande soirée de rentrée avec DJ, food trucks et animations.", date: "15 Fév 2025", time: "20:00", location: "Foyer étudiant", organizer: "BDE Informatique", attendees: 120, maxAttendees: 200, price: "5 EUR", tags: ["Soirée", "BDE"], type: "campus", contact: { type: "instagram", value: "@bde_info" } },
  { id: "e2", title: "Tournoi FIFA inter-filières", description: "Tournoi de FIFA 25. Inscriptions par équipes de 2.", date: "18 Fév 2025", time: "14:00", location: "Salle de jeux campus", organizer: "Club Gaming", attendees: 32, maxAttendees: 64, price: "Gratuit", tags: ["Gaming", "Tournoi"], type: "campus", contact: { type: "whatsapp", value: "+32470123456" } },
  { id: "e3", title: "Conférence IA et Emploi", description: "Table ronde avec des professionnels sur l'impact de l'IA.", date: "20 Fév 2025", time: "18:00", location: "Amphi Turing", organizer: "Dépt. Informatique", attendees: 85, maxAttendees: 300, price: "Gratuit", tags: ["Conférence", "IA"], type: "campus" },
  { id: "e4", title: "Vente pâtisseries solidaire", description: "Vente au profit d'une association humanitaire.", date: "21 Fév 2025", time: "12:00", location: "Hall principal", organizer: "Asso Solidaire", attendees: 0, maxAttendees: 0, price: "Libre", tags: ["Solidaire", "Food"], type: "campus", contact: { type: "unilife", value: "asso-solidaire" } },
  { id: "e5", title: "Atelier CV et Lettre de motivation", description: "Aide à la rédaction avec des professionnels RH.", date: "22 Fév 2025", time: "10:00", location: "Salle 301", organizer: "Service Orientation", attendees: 18, maxAttendees: 30, price: "Gratuit", tags: ["Carrière", "Atelier"], type: "campus" },
];

const LOCAL_EVENTS: CampusEvent[] = [
  { id: "l1", title: "Marché étudiant nocturne", description: "Marché de nuit avec stands food, artisanat et musique live.", date: "16 Fév 2025", time: "18:00", location: "Place de la Mairie", organizer: "Mairie", attendees: 500, maxAttendees: 0, price: "Gratuit", tags: ["Marché", "Ville"], type: "local" },
  { id: "l2", title: "Festival de courts-métrages", description: "Projection de courts-métrages d'étudiants. Vote du public.", date: "23 Fév 2025", time: "19:00", location: "Cinéma Le Rio", organizer: "Association Bobine", attendees: 75, maxAttendees: 120, price: "3 EUR", tags: ["Cinéma", "Culture"], type: "local" },
  { id: "l3", title: "Job dating restauration", description: "Rencontrez des employeurs qui recrutent des étudiants.", date: "25 Fév 2025", time: "09:00", location: "Espace Emploi", organizer: "Pôle Emploi Jeunes", attendees: 45, maxAttendees: 100, price: "Gratuit", tags: ["Emploi", "Job"], type: "local" },
];

const CIRCLES_STORAGE_KEY = "unilife360-circles";

export default function SocialPage() {
  const [reservedEvents, setReservedEvents] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"campus" | "local">("campus");
  const [circles, setCircles] = useState<Circle[]>(DEFAULT_CIRCLES);
  const [showCreateCircle, setShowCreateCircle] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [newCircle, setNewCircle] = useState({ name: "", description: "", tags: "" });
  const [newEvent, setNewEvent] = useState({ title: "", description: "", date: "", time: "", location: "", price: "Gratuit", contactType: "instagram" as "whatsapp" | "instagram" | "unilife", contactValue: "" });
  const [customEvents, setCustomEvents] = useState<CampusEvent[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CIRCLES_STORAGE_KEY);
      if (saved) setCircles(JSON.parse(saved));
      const savedEvents = localStorage.getItem("unilife360-custom-events");
      if (savedEvents) setCustomEvents(JSON.parse(savedEvents));
    } catch { /* ignore */ }
  }, []);

  function handleReserve(eventId: string) {
    setReservedEvents((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  }

  function handleCreateCircle() {
    if (!newCircle.name.trim()) return;
    const circle: Circle = {
      id: Date.now().toString(),
      name: newCircle.name.trim(),
      members: 1,
      description: newCircle.description.trim(),
      tags: newCircle.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    const updated = [...circles, circle];
    setCircles(updated);
    localStorage.setItem(CIRCLES_STORAGE_KEY, JSON.stringify(updated));
    setNewCircle({ name: "", description: "", tags: "" });
    setShowCreateCircle(false);
  }

  function handleCreateEvent() {
    if (!newEvent.title.trim()) return;
    const event: CampusEvent = {
      id: Date.now().toString(),
      title: newEvent.title.trim(),
      description: newEvent.description.trim(),
      date: newEvent.date || "À définir",
      time: newEvent.time || "À définir",
      location: newEvent.location.trim() || "À définir",
      organizer: "Moi",
      attendees: 0,
      maxAttendees: 0,
      price: newEvent.price || "Gratuit",
      tags: ["Mon événement"],
      type: "campus",
      contact: newEvent.contactValue ? { type: newEvent.contactType, value: newEvent.contactValue } : undefined,
    };
    const updated = [...customEvents, event];
    setCustomEvents(updated);
    localStorage.setItem("unilife360-custom-events", JSON.stringify(updated));
    setNewEvent({ title: "", description: "", date: "", time: "", location: "", price: "Gratuit", contactType: "instagram", contactValue: "" });
    setShowCreateEvent(false);
  }

  const displayedEvents = activeTab === "campus" ? [...CAMPUS_EVENTS, ...customEvents] : LOCAL_EVENTS;

  return (
    <div>
      <ModuleHeader title="Campus Social" description="Cercles, événements campus et vie locale">
        <Button variant="social" onClick={() => setShowCreateCircle(true)}>
          <Plus className="w-4 h-4" />
          Créer un cercle
        </Button>
        <Button variant="outline" onClick={() => setShowCreateEvent(true)}>
          <Calendar className="w-4 h-4" />
          Créer un événement
        </Button>
      </ModuleHeader>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Circles */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Mes Cercles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {circles.map((circle) => (
                <Link key={circle.id} href={`/social/circles/${circle.id}`}>
                  <div className="brutalist-card p-3 bg-[var(--card)] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform cursor-pointer mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-extrabold">{circle.name}</p>
                      <span className="text-xs font-bold text-[var(--muted-foreground)]">{circle.members} membres</span>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] mb-2">{circle.description}</p>
                    <div className="flex gap-1 flex-wrap">
                      {circle.tags.map((tag) => (
                        <Badge key={tag} variant="social" className="text-[10px] px-2 py-0">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Events */}
        <div className="lg:col-span-2">
          <div className="flex gap-3 mb-4">
            <button onClick={() => setActiveTab("campus")}
              className={`flex-1 h-11 rounded-xl border-2 border-[var(--border)] text-sm font-bold transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 ${activeTab === "campus" ? "bg-[var(--color-social)] shadow-[var(--shadow-brutalist)]" : "bg-[var(--card)] text-[var(--muted-foreground)] translate-x-[2px] translate-y-[2px]"
                }`}>
              <GraduationCap className="w-4 h-4" />Campus
            </button>
            <button onClick={() => setActiveTab("local")}
              className={`flex-1 h-11 rounded-xl border-2 border-[var(--border)] text-sm font-bold transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 ${activeTab === "local" ? "bg-[var(--color-social)] shadow-[var(--shadow-brutalist)]" : "bg-[var(--card)] text-[var(--muted-foreground)] translate-x-[2px] translate-y-[2px]"
                }`}>
              <Globe className="w-4 h-4" />Événements locaux
            </button>
          </div>

          <div className="space-y-4">
            {displayedEvents.map((event) => {
              const isReserved = reservedEvents.has(event.id);
              return (
                <Card key={event.id} hover>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-extrabold text-lg">{event.title}</h3>
                          {event.type === "local" && (
                            <Badge variant="outline" className="text-[10px]"><Globe className="w-3 h-3 mr-1" />Local</Badge>
                          )}
                        </div>
                        <p className="text-sm text-[var(--muted-foreground)] mb-3">{event.description}</p>
                        <div className="flex flex-wrap gap-3 text-xs font-bold text-[var(--muted-foreground)]">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{event.date} à {event.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{event.organizer}</span>
                        </div>
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {event.tags.map((tag) => (
                            <Badge key={tag} variant="social" className="text-[10px] px-2 py-0">{tag}</Badge>
                          ))}
                        </div>
                        {/* Contact Info */}
                        {event.contact && (
                          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-[var(--border)] bg-[var(--muted)] text-xs font-bold">
                            {event.contact.type === "whatsapp" && <><Phone className="w-3 h-3 text-green-600" /> WhatsApp : {event.contact.value}</>}
                            {event.contact.type === "instagram" && <><MessageSquare className="w-3 h-3 text-pink-500" /> Instagram : {event.contact.value}</>}
                            {event.contact.type === "unilife" && <><Star className="w-3 h-3 text-yellow-500" /> UniLife : {event.contact.value}</>}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right space-y-2">
                        <div className="flex items-center gap-1 text-sm font-extrabold justify-end">
                          <Ticket className="w-4 h-4" />{event.price}
                        </div>
                        {event.maxAttendees > 0 && (
                          <p className="text-[10px] text-[var(--muted-foreground)]">{event.attendees}/{event.maxAttendees} inscrits</p>
                        )}
                        <Button variant={isReserved ? "outline" : "social"} size="sm" onClick={() => handleReserve(event.id)}>
                          {isReserved ? (<><Heart className="w-3 h-3 fill-current" />Inscrit</>) : (<><Star className="w-3 h-3" />Réserver</>)}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Create Circle Modal */}
      {showCreateCircle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="brutalist-card p-6 w-full max-w-lg bg-[var(--background)]">
            <h3 className="text-xl font-extrabold mb-5">Créer un cercle</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="circle-name" className="text-sm font-bold">Nom du cercle *</label>
                <input id="circle-name" type="text" value={newCircle.name} onChange={(e) => setNewCircle((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Ex : Club Développement Web" className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" autoFocus />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="circle-desc" className="text-sm font-bold">Description</label>
                <input id="circle-desc" type="text" value={newCircle.description} onChange={(e) => setNewCircle((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Décris ton cercle en quelques mots" className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="circle-tags" className="text-sm font-bold">Tags (séparés par des virgules)</label>
                <input id="circle-tags" type="text" value={newCircle.tags} onChange={(e) => setNewCircle((p) => ({ ...p, tags: e.target.value }))}
                  placeholder="Ex : Tech, Coding, Web" className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <Button variant="outline" onClick={() => setShowCreateCircle(false)}>Annuler</Button>
              <Button variant="social" onClick={handleCreateCircle}><Plus className="w-4 h-4" />Créer</Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="brutalist-card p-6 w-full max-w-lg bg-[var(--background)] max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-extrabold mb-5">Créer un événement</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="event-title" className="text-sm font-bold">Titre *</label>
                <input id="event-title" type="text" value={newEvent.title} onChange={(e) => setNewEvent((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Ex : Soirée pizza du BDE" className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" autoFocus />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="event-desc" className="text-sm font-bold">Description</label>
                <input id="event-desc" type="text" value={newEvent.description} onChange={(e) => setNewEvent((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Détails de l'événement" className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="event-date" className="text-sm font-bold">Date</label>
                  <input id="event-date" type="date" value={newEvent.date} onChange={(e) => setNewEvent((p) => ({ ...p, date: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="event-time" className="text-sm font-bold">Heure</label>
                  <input id="event-time" type="time" value={newEvent.time} onChange={(e) => setNewEvent((p) => ({ ...p, time: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="event-location" className="text-sm font-bold">Lieu</label>
                  <input id="event-location" type="text" value={newEvent.location} onChange={(e) => setNewEvent((p) => ({ ...p, location: e.target.value }))}
                    placeholder="Ex : Foyer étudiant" className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="event-price" className="text-sm font-bold">Prix</label>
                  <input id="event-price" type="text" value={newEvent.price} onChange={(e) => setNewEvent((p) => ({ ...p, price: e.target.value }))}
                    placeholder="Gratuit" className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold">Contact du responsable</label>
                <div className="flex gap-2">
                  <select value={newEvent.contactType} onChange={(e) => setNewEvent((p) => ({ ...p, contactType: e.target.value as "whatsapp" | "instagram" | "unilife" }))}
                    className="px-3 py-3 border-2 border-[var(--border)] rounded-xl font-bold text-sm">
                    <option value="instagram">Instagram</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="unilife">UniLife</option>
                  </select>
                  <input type="text" value={newEvent.contactValue} onChange={(e) => setNewEvent((p) => ({ ...p, contactValue: e.target.value }))}
                    placeholder="@compte ou +32..." className="flex-1 px-4 py-3 border-2 border-[var(--border)] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <Button variant="outline" onClick={() => setShowCreateEvent(false)}>Annuler</Button>
              <Button variant="social" onClick={handleCreateEvent}><Plus className="w-4 h-4" />Créer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
