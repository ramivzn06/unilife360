"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModuleHeader } from "@/components/shared/module-header";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap, MapPin, UserPlus, MessageSquare, Check, Clock,
  Heart, Sparkles, ArrowLeft, Share2, Copy, User
} from "lucide-react";
import Link from "next/link";

interface PublicProfile {
  id: string;
  full_name: string;
  username: string;
  social_handle: string | null;
  bio: string | null;
  university: string | null;
  study_field: string | null;
  study_year: number | null;
  city: string | null;
  country: string | null;
  avatar_url: string | null;
  interests: string[];
  gender: string | null;
}

// Demo profiles for fallback
const DEMO_PROFILES: Record<string, PublicProfile> = {
  marie_l: {
    id: "f1", full_name: "Marie Lambert", username: "marie_l", social_handle: "@marie_l",
    bio: "Passionnée de code et de data science", university: "ULB", study_field: "Informatique",
    study_year: 2, city: "Bruxelles", country: "BE", avatar_url: null,
    interests: ["Code", "Data Science", "Piano", "Café"], gender: "femme"
  },
  thomas_k: {
    id: "f2", full_name: "Thomas Kerr", username: "thomas.k", social_handle: "@thomas.k",
    bio: "Étudiant en sciences éco, amateur de running", university: "UCLouvain", study_field: "Sciences éco",
    study_year: 3, city: "Louvain-la-Neuve", country: "BE", avatar_url: null,
    interests: ["Running", "Économie", "Voyages"], gender: "homme"
  },
};

type FriendStatus = "none" | "friends" | "request_sent" | "request_received" | "self" | "not_logged_in";

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [friendStatus, setFriendStatus] = useState<FriendStatus>("none");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Try Supabase first, fallback to demo
    async function loadProfile() {
      try {
        const { getPublicProfile } = await import("@/actions/profile-actions");
        const { checkFriendshipStatus } = await import("@/actions/profile-actions");
        const result = await getPublicProfile(username);

        if (result.profile) {
          setProfile(result.profile as PublicProfile);
          const statusResult = await checkFriendshipStatus(result.profile.id);
          setFriendStatus(statusResult.status);
        } else {
          // Demo fallback
          const demoProfile = DEMO_PROFILES[username] || {
            id: "unknown", full_name: username, username,
            social_handle: `@${username}`, bio: null, university: null,
            study_field: null, study_year: null, city: null, country: null,
            avatar_url: null, interests: [], gender: null,
          };
          setProfile(demoProfile);
        }
      } catch {
        // Demo fallback on error
        const demoProfile = DEMO_PROFILES[username] || {
          id: "unknown", full_name: username, username,
          social_handle: `@${username}`, bio: null, university: null,
          study_field: null, study_year: null, city: null, country: null,
          avatar_url: null, interests: [], gender: null,
        };
        setProfile(demoProfile);
      }
      setLoading(false);
    }
    loadProfile();
  }, [username]);

  async function handleAddFriend() {
    if (!profile) return;
    try {
      const { sendFriendRequest } = await import("@/actions/friend-actions");
      const result = await sendFriendRequest(profile.id);
      if (result.success) setFriendStatus("request_sent");
    } catch {
      // Demo mode
      setFriendStatus("request_sent");
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/invite/${username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const initials = profile.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const yearLabel = profile.study_year
    ? profile.country === "FR"
      ? `L${Math.min(profile.study_year, 3)}`
      : `Bac ${Math.min(profile.study_year, 3)}`
    : null;

  return (
    <div className="space-y-6 pb-24 md:pb-0">
      <ModuleHeader title="Profil">
        <Link href="/friends">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </Link>
      </ModuleHeader>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-24 h-24 rounded-full border-2 border-[var(--border)] object-cover shadow-[var(--shadow-brutalist)]"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-2 border-[var(--border)] bg-[var(--color-social)] flex items-center justify-center text-2xl font-extrabold shadow-[var(--shadow-brutalist)]">
                {initials}
              </div>
            )}

            {/* Name */}
            <h2 className="text-xl font-extrabold mt-4">{profile.full_name}</h2>
            {profile.social_handle && (
              <p className="text-sm font-bold text-[var(--color-social-dark)]">{profile.social_handle}</p>
            )}
            {profile.bio && (
              <p className="text-sm text-[var(--muted-foreground)] mt-2 max-w-sm">{profile.bio}</p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {profile.university && (
                <Badge className="bg-[var(--color-studies)]">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  {profile.university}
                </Badge>
              )}
              {profile.study_field && (
                <Badge className="bg-[var(--color-finance)]">
                  {profile.study_field}
                </Badge>
              )}
              {yearLabel && (
                <Badge className="bg-[var(--muted)]">{yearLabel}</Badge>
              )}
              {profile.gender && (
                <Badge className="bg-[var(--color-social-light)]">
                  {profile.gender === "homme" ? "Homme" : profile.gender === "femme" ? "Femme" : profile.gender}
                </Badge>
              )}
              {profile.city && (
                <Badge className="bg-[var(--muted)]">
                  <MapPin className="w-3 h-3 mr-1" />
                  {profile.city}
                </Badge>
              )}
            </div>

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold text-[var(--muted-foreground)] mb-2 flex items-center gap-1 justify-center">
                  <Heart className="w-3 h-3" /> Centres d&apos;intérêt
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {profile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[var(--color-social-light)] border border-[var(--border)]"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-6 w-full max-w-xs">
              {friendStatus === "none" && (
                <Button variant="social" className="flex-1" onClick={handleAddFriend}>
                  <UserPlus className="w-4 h-4" />
                  Ajouter
                </Button>
              )}
              {friendStatus === "request_sent" && (
                <Button variant="outline" className="flex-1" disabled>
                  <Clock className="w-4 h-4" />
                  Demande envoyée
                </Button>
              )}
              {friendStatus === "friends" && (
                <Button variant="outline" className="flex-1" disabled>
                  <Check className="w-4 h-4" />
                  Amis
                </Button>
              )}
              {friendStatus !== "self" && (
                <Button variant="outline" onClick={() => {}}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
              )}
              <Button variant="outline" onClick={handleCopyLink}>
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App promo for demo */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <Sparkles className="w-4 h-4 text-[var(--primary)]" />
        <p className="text-xs font-bold text-[var(--muted-foreground)]">
          Profil UniLife 360
        </p>
      </div>
    </div>
  );
}
