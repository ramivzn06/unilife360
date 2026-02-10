"use client";

import { useState } from "react";
import Link from "next/link";
import { ModuleHeader } from "@/components/shared/module-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Check,
  CheckCheck,
  Wallet,
  Calendar,
  BookOpen,
  Users,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NotificationType =
  | "finance"
  | "schedule"
  | "academic"
  | "social"
  | "system"
  | "ai";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: LucideIcon; color: string; label: string; badge: BadgeVariant }
> = {
  finance: {
    icon: Wallet,
    color: "border-l-[var(--color-finance)]",
    label: "Finance",
    badge: "finance",
  },
  schedule: {
    icon: Calendar,
    color: "border-l-[var(--color-sport)]",
    label: "Planning",
    badge: "sport",
  },
  academic: {
    icon: BookOpen,
    color: "border-l-[var(--color-studies)]",
    label: "Etudes",
    badge: "studies",
  },
  social: {
    icon: Users,
    color: "border-l-[var(--color-social)]",
    label: "Social",
    badge: "social",
  },
  system: {
    icon: AlertTriangle,
    color: "border-l-gray-400",
    label: "Systeme",
    badge: "outline",
  },
  ai: {
    icon: Sparkles,
    color: "border-l-yellow-400",
    label: "IA",
    badge: "default",
  },
};

type BadgeVariant =
  | "default"
  | "finance"
  | "studies"
  | "social"
  | "sport"
  | "outline"
  | "destructive";

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "finance",
    title: "Budget mensuel mis a jour",
    message:
      "Tes depenses du mois atteignent 628,49 EUR. Il te reste 571,51 EUR de budget.",
    time: "Il y a 5 min",
    read: false,
    link: "/finance",
  },
  {
    id: "n2",
    type: "ai",
    title: "Conseil IA financier",
    message:
      "J'ai remarque que tes depenses alimentaires sont 15% au-dessus de la moyenne etudiante. Veux-tu des astuces ?",
    time: "Il y a 30 min",
    read: false,
    link: "/finance/advisor",
  },
  {
    id: "n3",
    type: "schedule",
    title: "Rappel : Cours de maths demain",
    message:
      "Cours de Mathematiques demain a 8h00, Amphi A. N'oublie pas tes notes !",
    time: "Il y a 1h",
    read: false,
    link: "/schedule",
  },
  {
    id: "n4",
    type: "social",
    title: "Nouvel evenement campus",
    message:
      "Le BDE Informatique organise une soiree d'integration le 15 fevrier. 120 inscrits deja !",
    time: "Il y a 2h",
    read: false,
    link: "/social",
  },
  {
    id: "n5",
    type: "academic",
    title: "Note ajoutee",
    message: "Ta note de TD Informatique a ete enregistree avec succes.",
    time: "Il y a 3h",
    read: true,
    link: "/academic",
  },
  {
    id: "n6",
    type: "finance",
    title: "Depense enregistree",
    message: "Depense de 32,50 EUR chez Carrefour ajoutee a tes transactions.",
    time: "Hier",
    read: true,
    link: "/finance",
  },
  {
    id: "n7",
    type: "system",
    title: "Bienvenue sur UniLife 360 !",
    message:
      "Ton compte est configure. Explore les modules Finance, Planning, Etudes et Social.",
    time: "Hier",
    read: true,
  },
  {
    id: "n8",
    type: "schedule",
    title: "Suggestion bien-etre",
    message:
      "Tu as un creneau libre demain entre 12h30 et 14h. Une pause active de 30 min ?",
    time: "Hier",
    read: true,
    link: "/schedule",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<NotificationType | "all">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  return (
    <div>
      <Link
        href="/finance"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Link>

      <ModuleHeader
        title="Notifications"
        description={`${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`}
      >
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="w-4 h-4" />
            Tout marquer comme lu
          </Button>
        )}
      </ModuleHeader>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl border-2 border-[var(--border)] transition-all cursor-pointer ${
            filter === "all"
              ? "bg-[var(--foreground)] text-[var(--background)] shadow-[var(--shadow-brutalist-sm)]"
              : "bg-[var(--card)] text-[var(--muted-foreground)]"
          }`}
        >
          Tout ({notifications.length})
        </button>
        {(
          Object.entries(TYPE_CONFIG) as [
            NotificationType,
            (typeof TYPE_CONFIG)[NotificationType],
          ][]
        ).map(([key, config]) => {
          const count = notifications.filter((n) => n.type === key).length;
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border-2 border-[var(--border)] transition-all cursor-pointer ${
                filter === key
                  ? "bg-[var(--foreground)] text-[var(--background)] shadow-[var(--shadow-brutalist-sm)]"
                  : "bg-[var(--card)] text-[var(--muted-foreground)]"
              }`}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="w-10 h-10 mx-auto text-[var(--muted-foreground)] mb-3" />
              <p className="text-sm font-bold text-[var(--muted-foreground)]">
                Aucune notification dans cette categorie
              </p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((notif) => {
            const config = TYPE_CONFIG[notif.type];
            const Icon = config.icon;

            const content = (
              <Card
                key={notif.id}
                className={`border-l-4 ${config.color} ${!notif.read ? "bg-[var(--color-finance-light)]" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl border-2 border-[var(--border)] shadow-[var(--shadow-brutalist-sm)] flex items-center justify-center bg-[var(--card)]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p
                          className={`text-sm ${!notif.read ? "font-extrabold" : "font-bold"}`}
                        >
                          {notif.title}
                        </p>
                        <Badge
                          variant={config.badge}
                          className="text-[10px] px-2 py-0"
                        >
                          {config.label}
                        </Badge>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)] mb-1">
                        {notif.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[var(--muted-foreground)]">
                          {notif.time}
                        </span>
                        {!notif.read && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              markAsRead(notif.id);
                            }}
                            className="text-[10px] font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Marquer comme lu
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );

            if (notif.link) {
              return (
                <Link key={notif.id} href={notif.link} onClick={() => markAsRead(notif.id)}>
                  {content}
                </Link>
              );
            }
            return <div key={notif.id}>{content}</div>;
          })
        )}
      </div>
    </div>
  );
}
