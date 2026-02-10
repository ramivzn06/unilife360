"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleHeader } from "@/components/shared/module-header";
import { EmptyState } from "@/components/shared/empty-state";
import { GraduationCap, Plus, Bot, BookOpen, FileText, Trash2, ExternalLink, Search, X, Building2, Filter } from "lucide-react";

interface Course {
  id: string;
  name: string;
  code: string;
  professor: string;
  syllabus: string;
  notes: { id: string; title: string; date: string }[];
  exams: { id: string; title: string; date: string }[];
  exercises: { id: string; title: string; date: string }[];
  summaries: { id: string; title: string; date: string }[];
  videos: { id: string; title: string; date: string }[];
}

const STORAGE_KEY = "unilife360-courses";

// Campus course catalog
const CAMPUS_CATALOG: Record<string, { faculties: Record<string, { code: string; name: string; professor: string }[]> }> = {
  "ULB": {
    faculties: {
      "Sciences & Informatique": [
        { code: "INFO-F101", name: "Introduction à la programmation", professor: "Prof. Massart" },
        { code: "INFO-F201", name: "Structures de données", professor: "Prof. Bontempi" },
        { code: "INFO-F302", name: "Algorithmique avancée", professor: "Prof. Méot" },
        { code: "INFO-F403", name: "Introduction aux réseaux", professor: "Prof. Quittek" },
        { code: "MATH-F101", name: "Analyse mathématique I", professor: "Prof. Steinfeld" },
        { code: "PHYS-F101", name: "Physique générale I", professor: "Prof. Descouvemont" },
      ],
      "Sciences économiques": [
        { code: "ECON-S101", name: "Microéconomie", professor: "Prof. Dejemeppe" },
        { code: "ECON-S201", name: "Macroéconomie", professor: "Prof. Périlleux" },
        { code: "GEST-S301", name: "Gestion financière", professor: "Prof. Artige" },
      ],
      "Droit": [
        { code: "DROIT-D101", name: "Introduction au droit", professor: "Prof. Hachez" },
        { code: "DROIT-D201", name: "Droit constitutionnel", professor: "Prof. Verdussen" },
        { code: "DROIT-D301", name: "Droit des obligations", professor: "Prof. Wéry" },
      ],
    },
  },
  "UCLouvain": {
    faculties: {
      "Informatique & Ingénierie": [
        { code: "LINFO1101", name: "Introduction à l'informatique", professor: "Prof. Van Roy" },
        { code: "LINFO1121", name: "Conception d'algorithmes", professor: "Prof. Schaus" },
        { code: "LEPL1402", name: "Informatique 2", professor: "Prof. Legay" },
        { code: "LMECA1100", name: "Mécanique rationnelle", professor: "Prof. Ronsse" },
      ],
      "Sciences économiques": [
        { code: "LECGE1115", name: "Économie politique", professor: "Prof. Aldashev" },
        { code: "LINGE1225", name: "Probabilités et statistiques", professor: "Prof. Hafner" },
      ],
    },
  },
  "VUB": {
    faculties: {
      "Engineering Sciences": [
        { code: "ENG-101", name: "Calculus I", professor: "Prof. Van Dooren" },
        { code: "ENG-201", name: "Linear Algebra", professor: "Prof. De Moor" },
        { code: "CS-101", name: "Programming Fundamentals", professor: "Prof. Steegmans" },
      ],
      "Social Sciences": [
        { code: "SOC-101", name: "Introduction to Sociology", professor: "Prof. Elchardus" },
        { code: "POL-201", name: "Political Theory", professor: "Prof. Devos" },
      ],
    },
  },
  "ULiège": {
    faculties: {
      "Sciences appliquées": [
        { code: "INFO0001", name: "Introduction à l'informatique", professor: "Prof. Geurts" },
        { code: "INFO0002", name: "Programmation orientée objet", professor: "Prof. Louppe" },
        { code: "MATH0001", name: "Algèbre linéaire", professor: "Prof. Nicolay" },
      ],
    },
  },
  "UNamur": {
    faculties: {
      "Informatique": [
        { code: "INFOB131", name: "Introduction à la programmation", professor: "Prof. Schobbens" },
        { code: "INFOB231", name: "Génie logiciel", professor: "Prof. Habra" },
      ],
    },
  },
};

export default function AcademicPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCampusSearch, setShowCampusSearch] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", code: "", professor: "", syllabus: "" });

  // Campus search state
  const [selectedUni, setSelectedUni] = useState("ULB");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCourses(JSON.parse(saved));
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  function handleCreateCourse() {
    if (!newCourse.name.trim() || !newCourse.code.trim()) return;
    const course: Course = {
      id: Date.now().toString(),
      name: newCourse.name.trim(),
      code: newCourse.code.trim().toUpperCase(),
      professor: newCourse.professor.trim(),
      syllabus: newCourse.syllabus.trim(),
      notes: [], exams: [], exercises: [], summaries: [], videos: [],
    };
    const updated = [...courses, course];
    setCourses(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setNewCourse({ name: "", code: "", professor: "", syllabus: "" });
    setShowModal(false);
  }

  function handleAddFromCatalog(item: { code: string; name: string; professor: string }) {
    const exists = courses.some((c) => c.code === item.code);
    if (exists) return;
    const course: Course = {
      id: Date.now().toString(),
      name: item.name,
      code: item.code,
      professor: item.professor,
      syllabus: "",
      notes: [], exams: [], exercises: [], summaries: [], videos: [],
    };
    const updated = [...courses, course];
    setCourses(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function handleDeleteCourse(id: string) {
    const updated = courses.filter((c) => c.id !== id);
    setCourses(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function totalItems(course: Course): number {
    return course.notes.length + course.exams.length + course.exercises.length + course.summaries.length + course.videos.length;
  }

  // Campus search helpers
  const uniData = CAMPUS_CATALOG[selectedUni];
  const faculties = uniData ? Object.keys(uniData.faculties) : [];
  const allCoursesList = uniData
    ? Object.entries(uniData.faculties).flatMap(([fac, items]) =>
      items.map((item) => ({ ...item, faculty: fac }))
    )
    : [];
  const filteredCampus = allCoursesList.filter((c) => {
    const matchFac = !selectedFaculty || c.faculty === selectedFaculty;
    const matchSearch = !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFac && matchSearch;
  });

  if (!mounted) return null;

  return (
    <div className="pb-24 md:pb-0">
      <ModuleHeader title="Études" description="Tes cours, notes et examens au même endroit">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setShowCampusSearch(true)} className="text-xs sm:text-sm">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Rechercher par campus</span>
            <span className="sm:hidden">Campus</span>
          </Button>
          <Link href="/academic/tutor">
            <Button variant="outline" className="text-xs sm:text-sm">
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">Tuteur IA</span>
              <span className="sm:hidden">IA</span>
            </Button>
          </Link>
          <Button variant="studies" onClick={() => setShowModal(true)} className="text-xs sm:text-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau cours</span>
            <span className="sm:hidden">Cours</span>
          </Button>
        </div>
      </ModuleHeader>

      {courses.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="Aucun cours"
          description="Ajoute tes cours ou recherche par campus pour commencer."
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => setShowCampusSearch(true)}>
              <Search className="w-4 h-4" />
              Rechercher par campus
            </Button>
            <Button variant="studies" onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4" />
              Créer manuellement
            </Button>
          </div>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {courses.map((course) => (
            <div key={course.id} className="relative group">
              <Link href={`/academic/courses/${course.id}`}>
                <Card module="studies" hover>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold bg-[var(--card)]/50 px-2 py-0.5 rounded border border-[var(--border)]">
                        {course.code}
                      </span>
                    </div>
                    <CardTitle className="text-sm sm:text-base">{course.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mb-3">
                      Prof. {course.professor || "Non renseigné"}
                    </p>
                    <div className="flex gap-3 sm:gap-4 text-[10px] sm:text-xs font-bold">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {course.notes.length} notes
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {course.exams.length} examens
                      </span>
                      <span className="flex items-center gap-1">
                        {totalItems(course)} éléments
                      </span>
                    </div>
                    {course.syllabus && (
                      <div className="mt-3">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)]">
                          <ExternalLink className="w-3 h-3" />
                          Syllabus disponible
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteCourse(course.id); }}
                className="absolute top-3 right-3 p-2 rounded-lg bg-[var(--card)] border-2 border-[var(--border)] opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-500 transition-all shadow-[var(--shadow-brutalist-sm)]">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="brutalist-card p-5 sm:p-6 w-full sm:max-w-lg bg-[var(--background)] rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg sm:text-xl font-extrabold mb-5">Créer un cours</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="course-name" className="text-sm font-bold">Nom du cours *</label>
                <input id="course-name" type="text" value={newCourse.name}
                  onChange={(e) => setNewCourse((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Ex : Algorithmique avancée"
                  className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--card)]" autoFocus />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="course-code" className="text-sm font-bold">Code du cours *</label>
                  <input id="course-code" type="text" value={newCourse.code}
                    onChange={(e) => setNewCourse((p) => ({ ...p, code: e.target.value }))}
                    placeholder="Ex : INFO-F302"
                    className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--card)]" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="course-prof" className="text-sm font-bold">Professeur</label>
                  <input id="course-prof" type="text" value={newCourse.professor}
                    onChange={(e) => setNewCourse((p) => ({ ...p, professor: e.target.value }))}
                    placeholder="Ex : Dr. Dupont"
                    className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--card)]" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="course-syllabus" className="text-sm font-bold">Lien du syllabus (optionnel)</label>
                <input id="course-syllabus" type="url" value={newCourse.syllabus}
                  onChange={(e) => setNewCourse((p) => ({ ...p, syllabus: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--card)]" />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>Annuler</Button>
              <Button variant="studies" onClick={handleCreateCourse}>
                <Plus className="w-4 h-4" />Créer le cours
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ====== CAMPUS SEARCH MODAL ====== */}
      {showCampusSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="brutalist-card w-full sm:max-w-2xl bg-[var(--background)] rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b-2 border-[var(--border)] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-studies)] border-2 border-[var(--border)] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold">Recherche par campus</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">Trouve tes cours par université et faculté</p>
                </div>
              </div>
              <button onClick={() => setShowCampusSearch(false)}
                className="p-2 rounded-xl hover:bg-[var(--muted)] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filters */}
            <div className="p-4 sm:p-6 pb-0 sm:pb-0 space-y-3 flex-shrink-0">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {Object.keys(CAMPUS_CATALOG).map((uni) => (
                  <button key={uni} onClick={() => { setSelectedUni(uni); setSelectedFaculty(""); }}
                    className={`flex-shrink-0 px-3 py-2 text-xs font-bold rounded-xl border-2 border-[var(--border)] transition-all cursor-pointer ${selectedUni === uni ? "bg-[var(--color-studies)] shadow-[var(--shadow-brutalist-sm)]" : "bg-[var(--card)]"
                      }`}>
                    {uni}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un code ou un nom..."
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-[var(--border)] rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--card)]" />
                </div>
                <select value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)}
                  className="px-3 py-2.5 border-2 border-[var(--border)] rounded-xl text-sm font-medium bg-[var(--card)] min-w-0">
                  <option value="">Toutes les facultés</option>
                  {faculties.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>

            {/* Results */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <p className="text-xs font-bold text-[var(--muted-foreground)] mb-3">
                {filteredCampus.length} cours trouvés à {selectedUni}
              </p>
              <div className="space-y-2">
                {filteredCampus.map((item) => {
                  const isAdded = courses.some((c) => c.code === item.code);
                  return (
                    <div key={item.code}
                      className="flex items-center justify-between p-3 rounded-xl border-2 border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] transition-colors">
                      <div className="flex-1 min-w-0 mr-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] sm:text-xs font-bold bg-[var(--color-studies-light)] px-2 py-0.5 rounded border border-[var(--border)]">
                            {item.code}
                          </span>
                          <span className="text-[10px] text-[var(--muted-foreground)]">{item.faculty}</span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold mt-1 truncate">{item.name}</p>
                        <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)]">{item.professor}</p>
                      </div>
                      <Button variant={isAdded ? "outline" : "studies"} size="sm" disabled={isAdded}
                        onClick={() => handleAddFromCatalog(item)} className="flex-shrink-0 text-xs">
                        {isAdded ? "Ajouté ✓" : (
                          <><Plus className="w-3 h-3" />Ajouter</>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
