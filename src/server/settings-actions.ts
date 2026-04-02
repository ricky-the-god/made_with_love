"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export interface UserPreferences {
  pref_recipes_private_by_default: boolean;
  pref_show_in_discover: boolean;
  pref_show_memorial_public: boolean;
  pref_notify_invitations: boolean;
  pref_notify_new_recipe: boolean;
  pref_notify_new_memory: boolean;
}

const PREFERENCE_COLUMNS = [
  "pref_recipes_private_by_default",
  "pref_show_in_discover",
  "pref_show_memorial_public",
  "pref_notify_invitations",
  "pref_notify_new_recipe",
  "pref_notify_new_memory",
] as const;

export async function getUserPreferences(): Promise<UserPreferences | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select(PREFERENCE_COLUMNS.join(", "))
    .eq("id", user.id)
    .single();

  if (error || !data) return null;

  return data as unknown as UserPreferences;
}

export async function saveUserPreferences(prefs: Partial<UserPreferences>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .update({ ...prefs, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/settings");
  return { error: null };
}
