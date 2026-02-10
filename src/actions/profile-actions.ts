"use server";

import { createClient } from "@/lib/supabase/server";

// ─── Get Public Profile ──────────────────────────────────────
export async function getPublicProfile(username: string) {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("users")
    .select(`
      id, full_name, username, social_handle, bio, university, study_field, study_year,
      city, country, avatar_url, interests, gender, is_profile_public
    `)
    .eq("username", username)
    .single();

  if (error || !profile) return { error: "Profil non trouvé" };
  if (!profile.is_profile_public) return { error: "Ce profil est privé" };

  return { profile };
}

// ─── Update Profile ──────────────────────────────────────────
export async function updateProfile(data: {
  full_name?: string;
  username?: string;
  social_handle?: string;
  bio?: string;
  university?: string;
  study_field?: string;
  study_year?: number;
  city?: string;
  country?: string;
  gender?: string;
  interests?: string[];
  is_profile_public?: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecté" };

  // Validate username uniqueness if changed
  if (data.username) {
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("username", data.username)
      .neq("id", user.id)
      .single();

    if (existing) return { error: "Ce username est déjà pris" };
  }

  const { error } = await supabase
    .from("users")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { error: "Erreur lors de la mise à jour du profil" };
  return { success: true };
}

// ─── Get My Profile ──────────────────────────────────────────
export async function getMyProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecté" };

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return { profile };
}

// ─── Check Friendship Status ─────────────────────────────────
export async function checkFriendshipStatus(targetUserId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "not_logged_in" as const };

  if (user.id === targetUserId) return { status: "self" as const };

  // Check if already friends
  const { data: friendship } = await supabase
    .from("friendships")
    .select("id")
    .eq("user_id", user.id)
    .eq("friend_id", targetUserId)
    .single();

  if (friendship) return { status: "friends" as const };

  // Check if request pending
  const { data: sentRequest } = await supabase
    .from("friend_requests")
    .select("id")
    .eq("from_user_id", user.id)
    .eq("to_user_id", targetUserId)
    .eq("status", "pending")
    .single();

  if (sentRequest) return { status: "request_sent" as const };

  // Check if they sent us a request
  const { data: receivedRequest } = await supabase
    .from("friend_requests")
    .select("id")
    .eq("from_user_id", targetUserId)
    .eq("to_user_id", user.id)
    .eq("status", "pending")
    .single();

  if (receivedRequest) return { status: "request_received" as const, requestId: receivedRequest.id };

  return { status: "none" as const };
}
