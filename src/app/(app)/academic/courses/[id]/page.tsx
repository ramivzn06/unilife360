"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleHeader } from "@/components/shared/module-header";
import {
    ArrowLeft,
    FileText,
    BookOpen,
    PenTool,
    Video,
    FileCheck,
    Plus,
    Share2,
    ExternalLink,
    Trash2,
} from "lucide-react";

interface CourseItem {
    id: string;
    title: string;
    date: string;
    type: string;
}

interface CourseData {
    name: string;
    code: string;
    professor: string;
    syllabus: string;
    notes: CourseItem[];
    exams: CourseItem[];
    exercises: CourseItem[];
    summaries: CourseItem[];
    videos: CourseItem[];
}

const TABS = [
    { key: "notes", label: "Notes", icon: FileText },
    { key: "exams", label: "Examens", icon: BookOpen },
    { key: "exercises", label: "Exercices", icon: PenTool },
    { key: "summaries", label: "Synthèses", icon: FileCheck },
    { key: "videos", label: "Vidéos", icon: Video },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const STORAGE_KEY = "unilife360-courses";

export default function CourseDetailPage() {
    const params = useParams();
    const courseId = params.id as string;
    const [activeTab, setActiveTab] = useState<TabKey>("notes");
    const [course, setCourse] = useState<CourseData | null>(null);
    const [mounted, setMounted] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItemTitle, setNewItemTitle] = useState("");

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const courses = JSON.parse(saved);
                const found = courses.find((c: { id: string }) => c.id === courseId);
                if (found) setCourse(found);
            }
        } catch {
            // ignore
        }
        setMounted(true);
    }, [courseId]);

    function handleAddItem() {
        if (!newItemTitle.trim() || !course) return;
        const newItem: CourseItem = {
            id: Date.now().toString(),
            title: newItemTitle.trim(),
            date: new Date().toLocaleDateString("fr-FR"),
            type: activeTab,
        };
        const updated = {
            ...course,
            [activeTab]: [...(course[activeTab] || []), newItem],
        };
        setCourse(updated);

        // Persist
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const courses = JSON.parse(saved);
                const idx = courses.findIndex((c: { id: string }) => c.id === courseId);
                if (idx !== -1) {
                    courses[idx] = updated;
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
                }
            }
        } catch {
            // ignore
        }

        setNewItemTitle("");
        setShowAddModal(false);
    }

    function handleDeleteItem(itemId: string) {
        if (!course) return;
        const updated = {
            ...course,
            [activeTab]: course[activeTab].filter((item) => item.id !== itemId),
        };
        setCourse(updated);

        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const courses = JSON.parse(saved);
                const idx = courses.findIndex((c: { id: string }) => c.id === courseId);
                if (idx !== -1) {
                    courses[idx] = updated;
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
                }
            }
        } catch {
            // ignore
        }
    }

    if (!mounted) return null;

    if (!course) {
        return (
            <div className="space-y-6">
                <Link href="/academic" className="inline-flex items-center gap-2 text-sm font-bold hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Retour aux cours
                </Link>
                <Card>
                    <CardContent className="p-10 text-center">
                        <p className="text-lg font-bold text-[var(--muted-foreground)]">Cours introuvable</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentItems = course[activeTab] || [];
    const ActiveTabIcon = TABS.find((t) => t.key === activeTab)?.icon || FileText;

    return (
        <div className="space-y-6">
            {/* Back Link */}
            <Link href="/academic" className="inline-flex items-center gap-2 text-sm font-bold hover:underline">
                <ArrowLeft className="w-4 h-4" /> Retour aux cours
            </Link>

            {/* Course Header */}
            <div className="brutalist-card p-6 bg-[var(--color-studies)]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="inline-flex items-center px-3 py-1 text-xs font-bold border-2 border-black rounded-lg bg-[var(--card)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                {course.code}
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold">{course.name}</h1>
                        <p className="text-sm font-medium mt-1 opacity-80">Prof. {course.professor}</p>
                    </div>
                    <div className="flex gap-2">
                        {course.syllabus && (
                            <a href={course.syllabus} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm">
                                    <ExternalLink className="w-4 h-4" />
                                    Syllabus
                                </Button>
                            </a>
                        )}
                        <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4" />
                            Partager
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {TABS.map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = activeTab === tab.key;
                    const count = (course[tab.key] || []).length;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all whitespace-nowrap ${isActive
                                    ? "border-[var(--border)] bg-[var(--color-studies)] shadow-[var(--shadow-brutalist-sm)]"
                                    : "border-transparent hover:border-[var(--border)] hover:bg-[var(--muted)]"
                                }`}
                        >
                            <TabIcon className="w-4 h-4" />
                            {tab.label}
                            {count > 0 && (
                                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-extrabold bg-black text-white rounded-full">
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <ActiveTabIcon className="w-5 h-5" />
                        {TABS.find((t) => t.key === activeTab)?.label}
                    </CardTitle>
                    <Button variant="studies" size="sm" onClick={() => setShowAddModal(true)}>
                        <Plus className="w-4 h-4" />
                        Ajouter
                    </Button>
                </CardHeader>
                <CardContent>
                    {currentItems.length === 0 ? (
                        <div className="text-center py-10">
                            <ActiveTabIcon className="w-12 h-12 mx-auto mb-3 text-[var(--muted-foreground)] opacity-40" />
                            <p className="text-sm font-bold text-[var(--muted-foreground)]">
                                Aucun élément dans cette catégorie
                            </p>
                            <p className="text-xs text-[var(--muted-foreground)] mt-1">
                                Clique sur &quot;Ajouter&quot; pour commencer
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {currentItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-4 rounded-xl border-2 border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg border-2 border-[var(--border)] bg-[var(--color-studies)] flex items-center justify-center">
                                            <ActiveTabIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{item.title}</p>
                                            <p className="text-xs text-[var(--muted-foreground)]">Ajouté le {item.date}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="p-2 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="brutalist-card p-6 w-full max-w-md bg-[var(--background)]">
                        <h3 className="text-lg font-extrabold mb-4">
                            Ajouter — {TABS.find((t) => t.key === activeTab)?.label}
                        </h3>
                        <input
                            type="text"
                            value={newItemTitle}
                            onChange={(e) => setNewItemTitle(e.target.value)}
                            placeholder="Titre de l'élément..."
                            className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] mb-4"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddItem();
                            }}
                        />
                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={() => setShowAddModal(false)}>
                                Annuler
                            </Button>
                            <Button variant="studies" onClick={handleAddItem}>
                                Ajouter
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
