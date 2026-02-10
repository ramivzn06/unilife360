"use client";

import { useState, useEffect } from "react";
import { ModuleHeader } from "@/components/shared/module-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dumbbell,
  Target,
  Flame,
  Clock,
  Trophy,
  Play,
  Check,
  ChevronRight,
  Sparkles,
  User,
  Ruler,
  Weight,
  MapPin,
  Heart,
  Zap,
  RotateCcw,
  Save,
} from "lucide-react";

/* ============================================
   TYPES
   ============================================ */

interface UserProfile {
  height: string;
  weight: string;
  age: string;
  gender: string;
  city: string;
  objective: string;
  level: string;
  frequency: string;
  limitations: string;
}

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  tips: string;
}

interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
  duration: string;
  calories: string;
}

/* ============================================
   DATA
   ============================================ */

const OBJECTIVES = [
  "Perte de poids",
  "Prise de masse",
  "Remise en forme",
  "Endurance",
  "Souplesse",
  "Bien-etre general",
  "Preparation sportive",
];

const LEVELS = ["Debutant", "Intermediaire", "Avance"];
const FREQUENCIES = ["2 fois/semaine", "3 fois/semaine", "4 fois/semaine", "5+ fois/semaine"];
const GENDERS = ["Homme", "Femme", "Autre"];

const DEFAULT_PROFILE: UserProfile = {
  height: "175",
  weight: "70",
  age: "21",
  gender: "Homme",
  city: "Paris",
  objective: "Remise en forme",
  level: "Debutant",
  frequency: "3 fois/semaine",
  limitations: "",
};

function generateProgram(profile: UserProfile): WorkoutDay[] {
  const isLoss = profile.objective === "Perte de poids";
  const isMass = profile.objective === "Prise de masse";
  const isEndurance = profile.objective === "Endurance";
  const isBeginner = profile.level === "Debutant";

  if (isLoss) {
    return [
      {
        day: "Lundi",
        focus: "Cardio + Full Body",
        duration: "45 min",
        calories: "350-450",
        exercises: [
          { name: "Jumping jacks", sets: "3", reps: "30 sec", rest: "15 sec", tips: "Gardez un rythme soutenu" },
          { name: "Squats", sets: isBeginner ? "3" : "4", reps: "15", rest: "45 sec", tips: "Descendez jusqu'a ce que les cuisses soient paralleles au sol" },
          { name: "Pompes (genoux si besoin)", sets: "3", reps: isBeginner ? "8" : "15", rest: "45 sec", tips: "Corps bien aligne, serrez les abdos" },
          { name: "Fentes alternees", sets: "3", reps: "12 par jambe", rest: "45 sec", tips: "Genou avant a 90 degres" },
          { name: "Mountain climbers", sets: "3", reps: "30 sec", rest: "30 sec", tips: "Amenez les genoux vers la poitrine rapidement" },
          { name: "Planche", sets: "3", reps: "30-45 sec", rest: "30 sec", tips: "Ne creusez pas le dos" },
        ],
      },
      {
        day: "Mercredi",
        focus: "HIIT Brule-graisse",
        duration: "30 min",
        calories: "300-400",
        exercises: [
          { name: "Burpees", sets: "4", reps: "10", rest: "30 sec", tips: "Version sans pompe pour les debutants" },
          { name: "Squats sautes", sets: "4", reps: "12", rest: "30 sec", tips: "Amortissez bien la reception" },
          { name: "Gainage lateral", sets: "3", reps: "20 sec/cote", rest: "15 sec", tips: "Hanches bien alignees" },
          { name: "High knees", sets: "4", reps: "30 sec", rest: "20 sec", tips: "Montez les genoux au niveau des hanches" },
          { name: "Crunchs", sets: "3", reps: "20", rest: "30 sec", tips: "Decollez seulement les epaules" },
        ],
      },
      {
        day: "Vendredi",
        focus: "Cardio + Bas du corps",
        duration: "40 min",
        calories: "300-350",
        exercises: [
          { name: "Marche rapide / footing leger", sets: "1", reps: "15 min", rest: "-", tips: "Rythme ou vous pouvez encore parler" },
          { name: "Sumo squats", sets: "3", reps: "15", rest: "45 sec", tips: "Pieds larges, pointes vers l'exterieur" },
          { name: "Pont fessier", sets: "3", reps: "15", rest: "30 sec", tips: "Serrez les fessiers en haut du mouvement" },
          { name: "Step-ups (chaise/marche)", sets: "3", reps: "10 par jambe", rest: "45 sec", tips: "Poussez avec le talon" },
          { name: "Etirements", sets: "1", reps: "10 min", rest: "-", tips: "Maintenez chaque position 20-30 sec" },
        ],
      },
    ];
  }

  if (isMass) {
    return [
      {
        day: "Lundi",
        focus: "Haut du corps - Poussee",
        duration: "50 min",
        calories: "250-350",
        exercises: [
          { name: "Pompes (variantes)", sets: "4", reps: isBeginner ? "10" : "15-20", rest: "60 sec", tips: "Prise large pour les pectoraux, serree pour les triceps" },
          { name: "Dips sur chaise", sets: "3", reps: "10-12", rest: "60 sec", tips: "Descendez jusqu'a 90 degres au coude" },
          { name: "Pike push-ups", sets: "3", reps: "8-10", rest: "60 sec", tips: "Pour cibler les epaules" },
          { name: "Pompes diamant", sets: "3", reps: "8-10", rest: "60 sec", tips: "Mains rapprochees sous la poitrine" },
          { name: "Planche haute + rotation", sets: "3", reps: "10/cote", rest: "45 sec", tips: "Controlez le mouvement" },
        ],
      },
      {
        day: "Mercredi",
        focus: "Bas du corps",
        duration: "50 min",
        calories: "300-400",
        exercises: [
          { name: "Squats bulgares", sets: "4", reps: "10/jambe", rest: "60 sec", tips: "Pied arriere sur une chaise" },
          { name: "Fentes marchees", sets: "3", reps: "12/jambe", rest: "60 sec", tips: "Grands pas, torse droit" },
          { name: "Hip thrust", sets: "4", reps: "15", rest: "60 sec", tips: "Dos sur une chaise, serrez en haut" },
          { name: "Mollets debout", sets: "4", reps: "20", rest: "30 sec", tips: "Sur une marche pour plus d'amplitude" },
          { name: "Wall sit", sets: "3", reps: "30-45 sec", rest: "45 sec", tips: "Cuisses paralleles au sol" },
        ],
      },
      {
        day: "Vendredi",
        focus: "Haut du corps - Tirage + Core",
        duration: "45 min",
        calories: "200-300",
        exercises: [
          { name: "Rowing inversee (sous table)", sets: "4", reps: "12", rest: "60 sec", tips: "Corps droit, tirez la poitrine vers la table" },
          { name: "Superman", sets: "3", reps: "15", rest: "45 sec", tips: "Decollez bras et jambes simultanement" },
          { name: "Pompes larges", sets: "3", reps: "12", rest: "60 sec", tips: "Prise plus large que les epaules" },
          { name: "Planche + touche epaule", sets: "3", reps: "10/cote", rest: "45 sec", tips: "Minimisez le mouvement des hanches" },
          { name: "Crunchs bicyclette", sets: "3", reps: "20", rest: "30 sec", tips: "Coude vers genou oppose" },
        ],
      },
    ];
  }

  if (isEndurance) {
    return [
      {
        day: "Lundi",
        focus: "Course progressive",
        duration: "40 min",
        calories: "350-450",
        exercises: [
          { name: "Echauffement marche rapide", sets: "1", reps: "5 min", rest: "-", tips: "Augmentez progressivement le rythme" },
          { name: "Footing leger", sets: "1", reps: "20 min", rest: "-", tips: "Rythme de conversation, nez-bouche" },
          { name: "Accelerations", sets: "4", reps: "30 sec rapide / 90 sec lent", rest: "-", tips: "Pas de sprint, juste plus rapide" },
          { name: "Retour au calme", sets: "1", reps: "5 min marche", rest: "-", tips: "Laissez le rythme cardiaque redescendre" },
          { name: "Etirements", sets: "1", reps: "5 min", rest: "-", tips: "Quadriceps, mollets, ischio-jambiers" },
        ],
      },
      {
        day: "Mercredi",
        focus: "Circuit endurance musculaire",
        duration: "35 min",
        calories: "300-350",
        exercises: [
          { name: "Squats", sets: "3", reps: "20", rest: "30 sec", tips: "Rythme soutenu, pas de pause en haut" },
          { name: "Pompes", sets: "3", reps: "12-15", rest: "30 sec", tips: "Rythme constant" },
          { name: "Fentes sautees", sets: "3", reps: "10/jambe", rest: "30 sec", tips: "Restez explosif" },
          { name: "Planche dynamique", sets: "3", reps: "45 sec", rest: "30 sec", tips: "Alternez bras tendus/coudes" },
          { name: "Burpees", sets: "3", reps: "10", rest: "45 sec", tips: "Gardez un rythme regulier" },
        ],
      },
      {
        day: "Samedi",
        focus: "Sortie longue",
        duration: "50 min",
        calories: "400-500",
        exercises: [
          { name: "Footing continu", sets: "1", reps: "35-40 min", rest: "-", tips: "Rythme confortable, respirez par le nez" },
          { name: "Retour au calme + etirements", sets: "1", reps: "10 min", rest: "-", tips: "Etirez tous les groupes musculaires" },
        ],
      },
    ];
  }

  // Default: Remise en forme / Bien-etre / Souplesse
  return [
    {
      day: "Lundi",
      focus: "Full Body doux",
      duration: "35 min",
      calories: "200-250",
      exercises: [
        { name: "Marche sur place + bras", sets: "1", reps: "3 min", rest: "-", tips: "Echauffement global" },
        { name: "Squats au poids du corps", sets: "3", reps: "12", rest: "45 sec", tips: "Dos droit, regard devant" },
        { name: "Pompes inclinees (mur/table)", sets: "3", reps: "10", rest: "45 sec", tips: "Ideal pour les debutants" },
        { name: "Fentes statiques", sets: "2", reps: "10/jambe", rest: "45 sec", tips: "Gardez l'equilibre" },
        { name: "Planche", sets: "3", reps: "20-30 sec", rest: "30 sec", tips: "Commencez sur les genoux si besoin" },
        { name: "Etirements complets", sets: "1", reps: "5 min", rest: "-", tips: "Respirez profondement" },
      ],
    },
    {
      day: "Mercredi",
      focus: "Cardio leger + Mobilite",
      duration: "30 min",
      calories: "180-220",
      exercises: [
        { name: "Marche rapide / velo", sets: "1", reps: "15 min", rest: "-", tips: "Rythme modere, agreable" },
        { name: "Rotations de hanches", sets: "2", reps: "10/cote", rest: "-", tips: "Cercles amples et lents" },
        { name: "Cat-cow (4 pattes)", sets: "2", reps: "10", rest: "-", tips: "Coordonnez avec la respiration" },
        { name: "Bird-dog", sets: "2", reps: "8/cote", rest: "30 sec", tips: "Bras et jambe opposes, equilibre" },
        { name: "Etirements yoga", sets: "1", reps: "8 min", rest: "-", tips: "Chien tete en bas, cobra, enfant" },
      ],
    },
    {
      day: "Vendredi",
      focus: "Renforcement + Relaxation",
      duration: "35 min",
      calories: "180-250",
      exercises: [
        { name: "Pont fessier", sets: "3", reps: "12", rest: "30 sec", tips: "Serrez 2 sec en haut" },
        { name: "Superman", sets: "3", reps: "10", rest: "30 sec", tips: "Mouvement lent et controle" },
        { name: "Chaise (wall sit)", sets: "3", reps: "20-30 sec", rest: "30 sec", tips: "Dos bien colle au mur" },
        { name: "Crunchs doux", sets: "2", reps: "15", rest: "30 sec", tips: "Ne tirez pas sur la nuque" },
        { name: "Relaxation guidee", sets: "1", reps: "5 min", rest: "-", tips: "Allongez-vous, respirez lentement" },
      ],
    },
  ];
}

const AI_SPORT_TIPS = [
  "Bois au moins 2L d'eau par jour, surtout les jours d'entrainement.",
  "Pour la recuperation, dors 7-8h minimum. Le muscle se construit au repos !",
  "Mange des proteines dans les 30 min apres ta seance (oeuf dur, yaourt grec, shake).",
  "Si tu as mal, c'est normal les premiers jours. Si la douleur persiste > 3 jours, consulte.",
  "Pres de ton campus, il y a probablement une salle universitaire gratuite. Renseigne-toi !",
];

const GYMS_BY_CITY: Record<string, { name: string; type: string; distance: string; price: string }[]> = {
  "Bruxelles": [
    { name: "ULB Sport City", type: "Universitaire", distance: "0.2 km", price: "Gratuit" },
    { name: "Basic-Fit Ixelles", type: "Salle privee", distance: "0.8 km", price: "19.99€/mois" },
    { name: "ADEPS - Bois de la Cambre", type: "Public", distance: "1.2 km", price: "Gratuit" },
    { name: "Aspria Arts-Loi", type: "Premium", distance: "2.5 km", price: "89€/mois" },
  ],
  "Paris": [
    { name: "Gymnase Universitaire", type: "Universitaire", distance: "0.3 km", price: "Gratuit" },
    { name: "Basic-Fit Quartier Latin", type: "Salle privee", distance: "0.5 km", price: "19.99€/mois" },
    { name: "Neoness Bastille", type: "Low cost", distance: "1.0 km", price: "15€/mois" },
    { name: "CMG Sports Club", type: "Premium", distance: "1.8 km", price: "69€/mois" },
  ],
  "Louvain-la-Neuve": [
    { name: "Centre sportif UCLouvain", type: "Universitaire", distance: "0.1 km", price: "50€/an" },
    { name: "Basic-Fit LLN", type: "Salle privee", distance: "0.6 km", price: "19.99€/mois" },
    { name: "Piscine de Blocry", type: "Public", distance: "0.8 km", price: "5€/seance" },
  ],
  "Liege": [
    { name: "Salle ULiege - Sart-Tilman", type: "Universitaire", distance: "0.2 km", price: "Gratuit" },
    { name: "Basic-Fit Liege", type: "Salle privee", distance: "1.0 km", price: "19.99€/mois" },
  ],
  "Lyon": [
    { name: "SUAPS Lyon", type: "Universitaire", distance: "0.3 km", price: "Gratuit" },
    { name: "Neoness Part-Dieu", type: "Low cost", distance: "0.7 km", price: "15€/mois" },
    { name: "Basic-Fit Lyon 3e", type: "Salle privee", distance: "1.2 km", price: "19.99€/mois" },
  ],
};

/* ============================================
   COMPONENT
   ============================================ */

export default function SportPage() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [showProfile, setShowProfile] = useState(false);
  const [program, setProgram] = useState<WorkoutDay[]>([]);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [activeDay, setActiveDay] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("unilife360-sport-profile");
    if (stored) {
      try {
        const p = JSON.parse(stored);
        setProfile({ ...DEFAULT_PROFILE, ...p });
      } catch { /* ignore */ }
    }
    const storedCompleted = localStorage.getItem("unilife360-sport-completed");
    if (storedCompleted) {
      try {
        setCompletedExercises(new Set(JSON.parse(storedCompleted)));
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    setProgram(generateProgram(profile));
  }, [profile]);

  function saveProfile() {
    localStorage.setItem("unilife360-sport-profile", JSON.stringify(profile));
    setSaved(true);
    setShowProfile(false);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleExercise(dayIdx: number, exIdx: number) {
    const key = `${dayIdx}-${exIdx}`;
    setCompletedExercises((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      localStorage.setItem("unilife360-sport-completed", JSON.stringify([...next]));
      return next;
    });
  }

  function resetProgress() {
    setCompletedExercises(new Set());
    localStorage.removeItem("unilife360-sport-completed");
  }

  const currentDay = program[activeDay];
  const totalExercises = currentDay?.exercises.length || 0;
  const doneExercises = currentDay?.exercises.filter((_, i) => completedExercises.has(`${activeDay}-${i}`)).length || 0;
  const progressPct = totalExercises > 0 ? Math.round((doneExercises / totalExercises) * 100) : 0;

  // BMI calculation
  const heightM = parseFloat(profile.height) / 100;
  const weightKg = parseFloat(profile.weight);
  const bmi = heightM > 0 ? weightKg / (heightM * heightM) : 0;
  const bmiCategory = bmi < 18.5 ? "Insuffisant" : bmi < 25 ? "Normal" : bmi < 30 ? "Surpoids" : "Obesite";

  return (
    <div>
      <ModuleHeader title="Sport & Bien-etre" description="Ton programme sportif personnalise par l'IA">
        <Button variant="sport" onClick={() => setShowProfile(!showProfile)}>
          <User className="w-4 h-4" />
          {showProfile ? "Fermer" : "Mon profil"}
        </Button>
      </ModuleHeader>

      {/* Profile Editor */}
      {showProfile && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Profil sportif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold flex items-center gap-1"><Ruler className="w-3 h-3" />Taille (cm)</label>
                <Input type="number" value={profile.height} onChange={(e) => setProfile({ ...profile, height: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold flex items-center gap-1"><Weight className="w-3 h-3" />Poids (kg)</label>
                <Input type="number" value={profile.weight} onChange={(e) => setProfile({ ...profile, weight: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold flex items-center gap-1"><Heart className="w-3 h-3" />Age</label>
                <Input type="number" value={profile.age} onChange={(e) => setProfile({ ...profile, age: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold">Genre</label>
                <Select value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })}>
                  {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold flex items-center gap-1"><MapPin className="w-3 h-3" />Ville</label>
                <Input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold flex items-center gap-1"><Target className="w-3 h-3" />Objectif</label>
                <Select value={profile.objective} onChange={(e) => setProfile({ ...profile, objective: e.target.value })}>
                  {OBJECTIVES.map((o) => <option key={o} value={o}>{o}</option>)}
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold flex items-center gap-1"><Zap className="w-3 h-3" />Niveau</label>
                <Select value={profile.level} onChange={(e) => setProfile({ ...profile, level: e.target.value })}>
                  {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold flex items-center gap-1"><Dumbbell className="w-3 h-3" />Frequence</label>
                <Select value={profile.frequency} onChange={(e) => setProfile({ ...profile, frequency: e.target.value })}>
                  {FREQUENCIES.map((f) => <option key={f} value={f}>{f}</option>)}
                </Select>
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              <label className="text-xs font-bold">Limitations / blessures (optionnel)</label>
              <Input value={profile.limitations} onChange={(e) => setProfile({ ...profile, limitations: e.target.value })}
                placeholder="Ex: douleur genou droit, mal de dos..." />
            </div>
            <Button variant="sport" className="mt-4" onClick={saveProfile}>
              <Save className="w-4 h-4" />{saved ? "Enregistre !" : "Sauvegarder et generer le programme"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="border-2 border-[var(--border)] rounded-xl shadow-[var(--shadow-brutalist)] p-5 bg-[var(--color-sport)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold opacity-70">Objectif</p>
              <p className="text-lg font-extrabold mt-1">{profile.objective}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[var(--card)]/50 border-2 border-[var(--border)] flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="border-2 border-[var(--border)] rounded-xl shadow-[var(--shadow-brutalist)] p-5 bg-[var(--color-sport)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold opacity-70">Niveau</p>
              <p className="text-lg font-extrabold mt-1">{profile.level}</p>
              <p className="text-xs font-bold mt-1">{profile.frequency}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[var(--card)]/50 border-2 border-[var(--border)] flex items-center justify-center">
              <Dumbbell className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="border-2 border-[var(--border)] rounded-xl shadow-[var(--shadow-brutalist)] p-5 bg-[var(--color-sport)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold opacity-70">IMC</p>
              <p className="text-lg font-extrabold mt-1">{bmi > 0 ? bmi.toFixed(1) : "-"}</p>
              <p className="text-xs font-bold mt-1">{bmi > 0 ? bmiCategory : ""}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[var(--card)]/50 border-2 border-[var(--border)] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="border-2 border-[var(--border)] rounded-xl shadow-[var(--shadow-brutalist)] p-5 bg-[var(--color-sport)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold opacity-70">Progression</p>
              <p className="text-lg font-extrabold mt-1">{progressPct}%</p>
              <p className="text-xs font-bold mt-1">{doneExercises}/{totalExercises} exercices</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[var(--card)]/50 border-2 border-[var(--border)] flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Program */}
        <div className="lg:col-span-2 space-y-4">
          {/* Day Tabs */}
          <div className="flex gap-2 flex-wrap">
            {program.map((day, i) => (
              <button key={i} onClick={() => setActiveDay(i)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl border-2 border-[var(--border)] transition-all cursor-pointer ${
                  activeDay === i ? "bg-[var(--color-sport)] shadow-[var(--shadow-brutalist-sm)]" : "bg-[var(--card)] text-[var(--muted-foreground)]"
                }`}>
                {day.day}
              </button>
            ))}
            <button onClick={resetProgress}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border-2 border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] cursor-pointer hover:bg-[var(--muted)]">
              <RotateCcw className="w-3 h-3" />Reset
            </button>
          </div>

          {currentDay && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      {currentDay.day} - {currentDay.focus}
                    </CardTitle>
                    <div className="flex gap-3 mt-2">
                      <Badge variant="sport" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />{currentDay.duration}
                      </Badge>
                      <Badge variant="sport" className="text-xs">
                        <Flame className="w-3 h-3 mr-1" />{currentDay.calories} kcal
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold">{progressPct}%</p>
                    <div className="w-20 h-2 bg-[var(--muted)] border border-[var(--border)] rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-[var(--color-sport)] rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentDay.exercises.map((ex, i) => {
                    const done = completedExercises.has(`${activeDay}-${i}`);
                    return (
                      <button key={i} onClick={() => toggleExercise(activeDay, i)}
                        className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border-2 border-[var(--border)] transition-all cursor-pointer ${
                          done ? "bg-[var(--color-sport-light)] opacity-70" : "bg-[var(--card)] hover:bg-[var(--muted)]"
                        }`}>
                        <div className={`w-7 h-7 rounded-lg border-2 border-[var(--border)] flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          done ? "bg-[var(--color-sport)]" : "bg-[var(--card)]"
                        }`}>
                          {done ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-extrabold ${done ? "line-through" : ""}`}>{ex.name}</p>
                          <div className="flex flex-wrap gap-2 mt-1 text-xs text-[var(--muted-foreground)]">
                            <span className="font-bold">{ex.sets} series</span>
                            <span>&middot;</span>
                            <span className="font-bold">{ex.reps}</span>
                            {ex.rest !== "-" && <><span>&middot;</span><span>Repos: {ex.rest}</span></>}
                          </div>
                          <p className="text-[11px] text-[var(--muted-foreground)] mt-1 italic">{ex.tips}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0 mt-1" />
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Conseils 360 */}
          <Card module="sport">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="w-5 h-5" />
                Conseils 360
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {AI_SPORT_TIPS.map((tip, i) => (
                <div key={i} className="brutalist-card p-3 bg-[var(--card)]">
                  <p className="text-[11px] leading-relaxed text-[var(--muted-foreground)]">{tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Gyms by city */}
          {profile.city && GYMS_BY_CITY[profile.city] && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="w-5 h-5" />
                  Salles pres de toi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {GYMS_BY_CITY[profile.city].map((gym, i) => (
                  <div key={i} className="p-2.5 rounded-xl border-2 border-[var(--border)] bg-[var(--card)] space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-extrabold">{gym.name}</p>
                      <span className="text-[10px] font-bold text-[var(--color-sport-dark)] bg-[var(--color-sport-light)] px-1.5 py-0.5 rounded-md border border-[var(--border)]">
                        {gym.distance}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[var(--muted-foreground)]">{gym.type}</span>
                      <span className="font-bold">{gym.price}</span>
                    </div>
                  </div>
                ))}
                <p className="text-[10px] text-[var(--muted-foreground)] text-center pt-1">
                  Base sur ta ville : {profile.city}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quick info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ton profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Taille</span>
                <span className="font-bold">{profile.height} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Poids</span>
                <span className="font-bold">{profile.weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Age</span>
                <span className="font-bold">{profile.age} ans</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Ville</span>
                <span className="font-bold">{profile.city}</span>
              </div>
              {profile.limitations && (
                <div className="border-t-2 border-[var(--border)] pt-2 mt-2">
                  <p className="text-xs font-bold text-red-600">Limitations : {profile.limitations}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
