"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleHeader } from "@/components/shared/module-header";
import { User, Save, Camera, GraduationCap, Wallet, AtSign, Copy, UserCircle, FileText } from "lucide-react";

interface ProfileData {
  nomComplet: string;
  email: string;
  username: string;
  socialHandle: string;
  genre: string;
  bio: string;
  universite: string;
  filiere: string;
  anneeEtude: string;
  dateNaissance: string;
  ville: string;
  pays: string;
  budgetMensuel: string;
  devise: string;
  photoUrl: string;
}

const defaultProfile: ProfileData = {
  nomComplet: "Rami Demo",
  email: "rami@universite.fr",
  username: "rami_demo",
  socialHandle: "@rami_demo",
  genre: "",
  bio: "",
  universite: "ULB",
  filiere: "Informatique",
  anneeEtude: "Bachelier 2",
  dateNaissance: "2001-05-15",
  ville: "Bruxelles",
  pays: "Belgique",
  budgetMensuel: "1200",
  devise: "EUR",
  photoUrl: "",
};

const STUDY_YEARS_BY_COUNTRY: Record<string, string[]> = {
  "Belgique": ["Bachelier 1", "Bachelier 2", "Bachelier 3", "Master 1", "Master 2", "Doctorat"],
  "France": ["L1", "L2", "L3", "M1", "M2", "Doctorat"],
  "Suisse": ["Bachelor 1", "Bachelor 2", "Bachelor 3", "Master 1", "Master 2", "Doctorat"],
  "Allemagne": ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Master 1", "Master 2"],
  "Espagne": ["Grado 1", "Grado 2", "Grado 3", "Grado 4", "Máster 1", "Máster 2", "Doctorado"],
  "Italie": ["Laurea 1", "Laurea 2", "Laurea 3", "Magistrale 1", "Magistrale 2", "Dottorato"],
  "Royaume-Uni": ["Year 1", "Year 2", "Year 3", "Master", "PhD"],
  "Maroc": ["Licence 1", "Licence 2", "Licence 3", "Master 1", "Master 2", "Doctorat"],
  "Canada": ["Year 1", "Year 2", "Year 3", "Year 4", "Master 1", "Master 2", "PhD"],
  "États-Unis": ["Freshman", "Sophomore", "Junior", "Senior", "Master 1", "Master 2", "PhD"],
};

const GENRES = [
  { value: "", label: "Préfère ne pas dire" },
  { value: "homme", label: "Homme" },
  { value: "femme", label: "Femme" },
  { value: "non-binaire", label: "Non-binaire" },
  { value: "autre", label: "Autre" },
];

const STORAGE_KEY = "unilife360-profile";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData) as Partial<ProfileData>;
        setProfile((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore parse errors
    }
    setMounted(true);
  }, []);

  function handleChange(field: keyof ProfileData, value: string) {
    setProfile((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "pays") {
        const years = STUDY_YEARS_BY_COUNTRY[value];
        if (years && !years.includes(prev.anneeEtude)) {
          updated.anneeEtude = years[0];
        }
      }
      return updated;
    });
    setSaved(false);
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setProfile((prev) => ({ ...prev, photoUrl: result }));
      setSaved(false);
    };
    reader.readAsDataURL(file);
  }

  function handleSave() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleCopyUsername() {
    navigator.clipboard.writeText(`https://unilife360.app/@${profile.username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const studyYears = STUDY_YEARS_BY_COUNTRY[profile.pays] || STUDY_YEARS_BY_COUNTRY["France"];

  if (!mounted) return null;

  return (
    <div className="space-y-6 sm:space-y-8 pb-24 md:pb-0">
      <ModuleHeader title="Mon Profil" />

      {/* Profile Header */}
      <Card>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-6">
          <div className="relative flex-shrink-0">
            {profile.photoUrl ? (
              <img src={profile.photoUrl} alt="Photo de profil"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[var(--border)] object-cover shadow-[var(--shadow-brutalist)]" />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[var(--border)] bg-[var(--muted)] flex items-center justify-center text-2xl sm:text-3xl font-extrabold shadow-[var(--shadow-brutalist)]">
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--muted-foreground)]" />
              </div>
            )}
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[var(--border)] bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center shadow-[var(--shadow-brutalist-sm)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer">
              <Camera className="w-4 h-4" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </div>

          <div className="flex flex-col items-center sm:items-start gap-1 flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{profile.nomComplet}</h2>
            <p className="text-xs sm:text-sm font-bold text-[var(--color-social-dark)]">@{profile.username}</p>
            <p className="text-xs sm:text-sm font-medium text-[var(--muted-foreground)]">{profile.email}</p>
            {profile.bio && (
              <p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2 text-center sm:text-left">{profile.bio}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-1 sm:mt-2 justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold border-2 border-[var(--border)] rounded-xl bg-[var(--color-studies)] shadow-[var(--shadow-brutalist-sm)]">
                <GraduationCap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {profile.universite}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold border-2 border-[var(--border)] rounded-xl bg-[var(--color-finance)] shadow-[var(--shadow-brutalist-sm)]">
                {profile.anneeEtude}
              </span>
              {profile.genre && (
                <span className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold border-2 border-[var(--border)] rounded-xl bg-[var(--color-social-light)]">
                  {GENRES.find((g) => g.value === profile.genre)?.label}
                </span>
              )}
            </div>
          </div>

          {/* Share profile */}
          <div className="flex-shrink-0">
            <button onClick={handleCopyUsername}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-[var(--border)] bg-[var(--muted)] hover:bg-[var(--card)] transition-colors cursor-pointer text-xs font-bold">
              <AtSign className="w-3.5 h-3.5" />
              {copied ? "Copié ✓" : "Partager"}
              {!copied && <Copy className="w-3 h-3" />}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Identité & Bio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <UserCircle className="w-5 h-5" />
            Identité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-1.5">
              <label htmlFor="nomComplet" className="text-xs sm:text-sm font-bold">Nom complet</label>
              <Input id="nomComplet" value={profile.nomComplet}
                onChange={(e) => handleChange("nomComplet", e.target.value)} placeholder="Votre nom complet" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="username" className="text-xs sm:text-sm font-bold">@username</label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                <input id="username" value={profile.username}
                  onChange={(e) => handleChange("username", e.target.value.replace(/[^a-zA-Z0-9._]/g, ""))}
                  placeholder="ton_username"
                  className="w-full pl-9 pr-4 py-2.5 border-2 border-[var(--border)] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--card)]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="socialHandle" className="text-xs sm:text-sm font-bold">Handle social</label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-social)]" />
                <input id="socialHandle" value={profile.socialHandle}
                  onChange={(e) => handleChange("socialHandle", e.target.value)}
                  placeholder="@ton_handle"
                  className="w-full pl-9 pr-4 py-2.5 border-2 border-[var(--border)] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-social)] bg-[var(--card)]" />
              </div>
              <p className="text-[10px] text-[var(--muted-foreground)]">Ton identifiant social (ex: @zanayana)</p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="genre" className="text-xs sm:text-sm font-bold">Genre</label>
              <Select id="genre" value={profile.genre} onChange={(e) => handleChange("genre", e.target.value)}>
                {GENRES.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
              </Select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs sm:text-sm font-bold">Email</label>
              <Input id="email" value={profile.email} disabled className="opacity-60" />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label htmlFor="bio" className="text-xs sm:text-sm font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />Bio</span>
                <span className="text-[10px] font-medium text-[var(--muted-foreground)]">{profile.bio.length}/160</span>
              </label>
              <textarea id="bio" value={profile.bio}
                onChange={(e) => handleChange("bio", e.target.value.slice(0, 160))}
                placeholder="Décris-toi en quelques mots..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--card)] resize-none" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations Personnelles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <GraduationCap className="w-5 h-5" />
            Informations académiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-1.5">
              <label htmlFor="universite" className="text-xs sm:text-sm font-bold">Université</label>
              <Input id="universite" value={profile.universite}
                onChange={(e) => handleChange("universite", e.target.value)} placeholder="Votre université" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="filiere" className="text-xs sm:text-sm font-bold">Filière d&apos;études</label>
              <Input id="filiere" value={profile.filiere}
                onChange={(e) => handleChange("filiere", e.target.value)} placeholder="Ex: Informatique" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pays" className="text-xs sm:text-sm font-bold">Pays</label>
              <Select id="pays" value={profile.pays} onChange={(e) => handleChange("pays", e.target.value)}>
                {Object.keys(STUDY_YEARS_BY_COUNTRY).map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="anneeEtude" className="text-xs sm:text-sm font-bold">Année d&apos;étude</label>
              <Select id="anneeEtude" value={profile.anneeEtude}
                onChange={(e) => handleChange("anneeEtude", e.target.value)}>
                {studyYears.map((year) => <option key={year} value={year}>{year}</option>)}
              </Select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="dateNaissance" className="text-xs sm:text-sm font-bold">Date de naissance</label>
              <Input id="dateNaissance" type="date" value={profile.dateNaissance}
                onChange={(e) => handleChange("dateNaissance", e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="ville" className="text-xs sm:text-sm font-bold">Ville</label>
              <Input id="ville" value={profile.ville}
                onChange={(e) => handleChange("ville", e.target.value)} placeholder="Ex: Bruxelles" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profil Financier */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Wallet className="w-5 h-5" />
            Profil financier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-1.5">
              <label htmlFor="budgetMensuel" className="text-xs sm:text-sm font-bold">Budget mensuel</label>
              <Input id="budgetMensuel" type="number" value={profile.budgetMensuel}
                onChange={(e) => handleChange("budgetMensuel", e.target.value)} placeholder="Ex: 1200" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="devise" className="text-xs sm:text-sm font-bold">Devise</label>
              <Select id="devise" value={profile.devise} onChange={(e) => handleChange("devise", e.target.value)}>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="USD">USD</option>
                <option value="CAD">CAD</option>
                <option value="CHF">CHF</option>
                <option value="MAD">MAD</option>
              </Select>
            </div>
          </div>

          <p className="mt-4 sm:mt-5 text-[10px] sm:text-xs font-medium text-[var(--muted-foreground)] border-2 border-[var(--border)] rounded-xl px-3 sm:px-4 py-2 sm:py-3 bg-[var(--muted)]">
            Ces informations permettent à l&apos;IA de personnaliser ses conseils financiers.
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 sm:gap-4">
        {saved && (
          <span className="text-xs sm:text-sm font-bold text-green-600 animate-pulse">
            ✓ Profil sauvegardé !
          </span>
        )}
        <Button size="lg" onClick={handleSave}>
          <Save className="w-4 h-4" />
          Sauvegarder le profil
        </Button>
      </div>
    </div>
  );
}
