"use server";

import { createClient } from "@/lib/supabase/server";

// ─── Send Friend Request ─────────────────────────────────────
export async function sendFriendRequest(toUserId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecté" };

  if (user.id === toUserId) return { error: "Tu ne peux pas t'ajouter toi-même !" };

  // Check if already friends
  const { data: existing } = await supabase
    .from("friendships")
    .select("id")
    .eq("user_id", user.id)
    .eq("friend_id", toUserId)
    .single();

  if (existing) return { error: "Vous êtes déjà amis" };

  // Check if request already exists
  const { data: existingReq } = await supabase
    .from("friend_requests")
    .select("id, status")
    .eq("from_user_id", user.id)
    .eq("to_user_id", toUserId)
    .single();

  if (existingReq) {
    if (existingReq.status === "pending") return { error: "Demande déjà envoyée" };
  }

  const { error } = await supabase.from("friend_requests").insert({
    from_user_id: user.id,
    to_user_id: toUserId,
    status: "pending",
  });

  if (error) return { error: "Erreur lors de l'envoi de la demande" };
  return { success: true };
}

// ─── Accept Friend Request ───────────────────────────────────
export async function acceptFriendRequest(requestId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecté" };

  // Get the request
  const { data: request } = await supabase
    .from("friend_requests")
    .select("*")
    .eq("id", requestId)
    .eq("to_user_id", user.id)
    .eq("status", "pending")
    .single();

  if (!request) return { error: "Demande non trouvée" };

  // Update request status
  await supabase
    .from("friend_requests")
    .update({ status: "accepted" })
    .eq("id", requestId);

  // Create double friendship entries
  await supabase.from("friendships").insert([
    { user_id: user.id, friend_id: request.from_user_id },
    { user_id: request.from_user_id, friend_id: user.id },
  ]);

  return { success: true };
}

// ─── Decline Friend Request ──────────────────────────────────
export async function declineFriendRequest(requestId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecté" };

  const { error } = await supabase
    .from("friend_requests")
    .update({ status: "declined" })
    .eq("id", requestId)
    .eq("to_user_id", user.id);

  if (error) return { error: "Erreur lors du refus" };
  return { success: true };
}

// ─── Get Friends List ────────────────────────────────────────
export async function getFriends() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecté", friends: [] };

  const { data: friendships } = await supabase
    .from("friendships")
    .select(`
      friend_id,
      friend:users!friendships_friend_id_fkey (
        id, full_name, username, social_handle, university, study_field, avatar_url, city
      )
    `)
    .eq("user_id", user.id);

  return { friends: friendships || [] };
}

// ─── Get Pending Requests ────────────────────────────────────
export async function getPendingRequests() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecté", requests: [] };

  const { data: requests } = await supabase
    .from("friend_requests")
    .select(`
      id, status, created_at,
      from_user:users!friend_requests_from_user_id_fkey (
        id, full_name, username, university, study_field, avatar_url
      )
    `)
    .eq("to_user_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return { requests: requests || [] };
}

// ─── Search Users ────────────────────────────────────────────
export async function searchUsers(query: string) {
  if (!query || query.length < 2) return { users: [] };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecté", users: [] };

  const { data: users } = await supabase
    .from("users")
    .select("id, full_name, username, university, study_field, avatar_url, city")
    .or(`full_name.ilike.%${query}%, username.ilike.%${query}%, university.ilike.%${query}%`)
    .neq("id", user.id)
    .limit(10);

  return { users: users || [] };
}

// ─── Generate Referral Code ──────────────────────────────────
export async function generateReferralCode() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecté" };

  // Check if user already has a referral code
  const { data: existing } = await supabase
    .from("referrals")
    .select("code")
    .eq("referrer_id", user.id)
    .is("referred_user_id", null)
    .single();

  if (existing) return { code: existing.code };

  const { data, error } = await supabase
    .from("referrals")
    .insert({ referrer_id: user.id })
    .select("code")
    .single();

  if (error) return { error: "Erreur lors de la génération du code" };
  return { code: data.code };
}
