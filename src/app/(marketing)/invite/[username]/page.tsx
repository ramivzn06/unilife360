import Link from "next/link";
import { GraduationCap, MapPin, UserPlus, Sparkles, Heart } from "lucide-react";
import { getPublicProfile } from "@/actions/profile-actions";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function InvitePage({ params }: Props) {
  const { username } = await params;
  const result = await getPublicProfile(username);

  // Fallback demo profile if Supabase not configured or no data
  const profile = result.profile || {
    id: "demo",
    full_name: "Rami Demo",
    username: username,
    social_handle: "@rami_demo",
    bio: "Étudiant en informatique passionné par le dev",
    university: "ULB",
    study_field: "Informatique",
    study_year: 2,
    city: "Bruxelles",
    country: "BE",
    avatar_url: null,
    interests: ["Code", "Sport", "Musique"],
    gender: "homme",
    is_profile_public: true,
  };

  const initials = profile.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || "??";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Profile Card */}
        <div className="brutalist-card p-6 sm:p-8 text-center">
          {/* Avatar */}
          <div className="mb-5">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-24 h-24 rounded-full border-2 border-[var(--border)] object-cover mx-auto shadow-[var(--shadow-brutalist)]"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-2 border-[var(--border)] bg-[var(--color-social)] flex items-center justify-center text-2xl font-extrabold mx-auto shadow-[var(--shadow-brutalist)]">
                {initials}
              </div>
            )}
          </div>

          {/* Name & Info */}
          <h1 className="text-xl sm:text-2xl font-extrabold">{profile.full_name}</h1>
          {profile.social_handle && (
            <p className="text-sm font-bold text-[var(--color-social-dark)] mt-1">
              {profile.social_handle}
            </p>
          )}

          {profile.bio && (
            <p className="text-sm text-[var(--muted-foreground)] mt-2 max-w-xs mx-auto">
              {profile.bio}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {profile.university && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold border-2 border-[var(--border)] rounded-xl bg-[var(--color-studies)] shadow-[var(--shadow-brutalist-sm)]">
                <GraduationCap className="w-3.5 h-3.5" />
                {profile.university}
              </span>
            )}
            {profile.study_field && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold border-2 border-[var(--border)] rounded-xl bg-[var(--color-finance)]">
                {profile.study_field}
              </span>
            )}
            {profile.city && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold border-2 border-[var(--border)] rounded-xl bg-[var(--muted)]">
                <MapPin className="w-3.5 h-3.5" />
                {profile.city}
              </span>
            )}
          </div>

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center mt-3">
              {profile.interests.map((interest: string) => (
                <span
                  key={interest}
                  className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-[var(--color-social-light)] border border-[var(--border)]"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="border-t-2 border-dashed border-[var(--border)] mt-6 pt-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-[var(--color-social)]" />
              <p className="text-sm font-bold text-[var(--muted-foreground)]">
                {profile.full_name?.split(" ")[0]} t&apos;invite sur UniLife 360 !
              </p>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mb-5">
              Rejoins la communauté étudiante pour gérer ta vie, tes finances et tes amis.
            </p>

            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 w-full h-12 px-6 font-bold text-sm border-2 border-[var(--border)] rounded-xl shadow-[var(--shadow-brutalist)] bg-[var(--primary)] text-[var(--primary-foreground)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Rejoindre pour ajouter {profile.full_name?.split(" ")[0]}
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full h-10 px-6 font-bold text-sm rounded-xl mt-3 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            >
              Déjà un compte ? Se connecter
            </Link>
          </div>
        </div>

        {/* App branding */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <Sparkles className="w-4 h-4 text-[var(--primary)]" />
          <p className="text-xs font-bold text-[var(--muted-foreground)]">
            UniLife 360 — Ta vie étudiante, simplifiée
          </p>
        </div>
      </div>
    </div>
  );
}
