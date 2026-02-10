"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function loginAction(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email et mot de passe requis." };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        if (error.message.includes("Invalid login credentials")) {
            return { error: "Email ou mot de passe incorrect." };
        }
        return { error: "Erreur de connexion. Réessaie plus tard." };
    }

    // Check if onboarding is completed
    const { data: { user } } = await supabase.auth.getUser();
    const onboardingCompleted = user?.user_metadata?.onboarding_completed;

    if (!onboardingCompleted) {
        redirect("/onboarding");
    }

    redirect("/finance");
}

export async function registerAction(formData: FormData) {
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!fullName || !email || !password) {
        return { error: "Tous les champs sont requis." };
    }

    if (password.length < 8) {
        return { error: "Le mot de passe doit faire au moins 8 caractères." };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                trial_start: new Date().toISOString(),
                onboarding_completed: false,
            },
        },
    });

    if (error) {
        if (error.message.includes("already registered")) {
            return { error: "Cet email est déjà utilisé." };
        }
        return { error: "Erreur lors de l'inscription. Réessaie plus tard." };
    }

    redirect("/onboarding");
}

export async function logoutAction() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
}

export async function oauthAction(provider: "google" | "github" | "facebook" | "apple") {
    const supabase = await createClient();
    const headerStore = await headers();
    const origin = headerStore.get("origin") || "http://localhost:3000";

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${origin}/callback`,
        },
    });

    if (error) {
        return { error: "Erreur de connexion OAuth." };
    }

    if (data.url) {
        redirect(data.url);
    }
}
