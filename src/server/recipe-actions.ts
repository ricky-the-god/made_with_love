"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAdminClient, createClient } from "@/lib/supabase/server";

// -------------------------------------------------------
// GET ALL RECIPES FOR THE CURRENT FAMILY
// -------------------------------------------------------
export async function getFamilyRecipes() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: profile } = await supabase.from("profiles").select("family_id").eq("id", user.id).single();

  if (!profile?.family_id) return [];

  const { data } = await supabase
    .from("recipes")
    .select(
      `
      *,
      family_members ( id, name, photo_url, relation )
    `,
    )
    .eq("family_id", profile.family_id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

// -------------------------------------------------------
// GET RECIPES FOR A SPECIFIC MEMBER
// -------------------------------------------------------
export async function getMemberRecipes(memberId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("recipes")
    .select("*")
    .eq("member_id", memberId)
    .order("created_at", { ascending: false });

  return data ?? [];
}

// -------------------------------------------------------
// GET SINGLE RECIPE WITH MEMORIES
// -------------------------------------------------------
export async function getRecipe(recipeId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("recipes")
    .select(
      `
      *,
      family_members ( id, name, photo_url, relation, country_of_origin ),
      memories ( * )
    `,
    )
    .eq("id", recipeId)
    .single();

  return data;
}

// -------------------------------------------------------
// GET SINGLE PUBLIC RECIPE
// -------------------------------------------------------
export async function getPublicRecipe(recipeId: string) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return null;
  }

  const supabase = createAdminClient();

  const { data } = await supabase
    .from("recipes")
    .select(
      `
      *,
      memories ( * )
    `,
    )
    .eq("id", recipeId)
    .eq("visibility", "public")
    .single();

  return data;
}

// -------------------------------------------------------
// CREATE RECIPE (manual)
// -------------------------------------------------------
export async function createRecipe(input: {
  title: string;
  member_id?: string;
  description?: string;
  ingredients?: string;
  steps?: string;
  notes?: string;
  prep_time?: string;
  cook_time?: string;
  servings?: string;
  country_of_origin?: string;
  culture_tag?: string;
  occasion?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data: profile } = await supabase.from("profiles").select("family_id").eq("id", user.id).single();

  if (!profile?.family_id) return { error: "No family found. Create a family first." };

  const { data, error } = await supabase
    .from("recipes")
    .insert({
      ...input,
      family_id: profile.family_id,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/recipes");
  return { recipe: data };
}

// -------------------------------------------------------
// UPDATE RECIPE
// -------------------------------------------------------
export async function updateRecipe(
  recipeId: string,
  updates: {
    title?: string;
    description?: string;
    ingredients?: string;
    steps?: string;
    notes?: string;
    prep_time?: string;
    cook_time?: string;
    servings?: string;
    country_of_origin?: string;
    culture_tag?: string;
    occasion?: string;
    image_url?: string;
    is_favorite?: boolean;
    is_family_favorite?: boolean;
    visibility?: "private" | "family" | "public";
    member_id?: string | null;
  },
) {
  const supabase = await createClient();

  const { error } = await supabase.from("recipes").update(updates).eq("id", recipeId);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/recipes/${recipeId}`);
  revalidatePath("/dashboard/recipes");
  revalidatePath("/dashboard/discover");
  revalidatePath(`/recipes/${recipeId}`);
  return { success: true };
}

// -------------------------------------------------------
// SET RECIPE VISIBILITY
// -------------------------------------------------------
export async function setRecipeVisibility(recipeId: string, visibility: "private" | "family" | "public") {
  return updateRecipe(recipeId, { visibility });
}

// -------------------------------------------------------
// TOGGLE FAVORITE
// -------------------------------------------------------
export async function toggleFavorite(recipeId: string, currentValue: boolean) {
  return updateRecipe(recipeId, { is_favorite: !currentValue });
}

// -------------------------------------------------------
// DELETE RECIPE
// -------------------------------------------------------
export async function deleteRecipe(recipeId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("recipes").delete().eq("id", recipeId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/recipes");
  redirect("/dashboard/recipes");
}

// -------------------------------------------------------
// GET FAVORITES
// -------------------------------------------------------
export async function getFavoriteRecipes() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { personal: [], family: [] };

  const { data: profile } = await supabase.from("profiles").select("family_id").eq("id", user.id).single();

  if (!profile?.family_id) return { personal: [], family: [] };

  const [personalResult, familyResult] = await Promise.all([
    supabase
      .from("recipes")
      .select(`*, family_members ( id, name, photo_url )`)
      .eq("family_id", profile.family_id)
      .eq("is_favorite", true)
      .order("updated_at", { ascending: false }),
    supabase
      .from("recipes")
      .select(`*, family_members ( id, name, photo_url )`)
      .eq("family_id", profile.family_id)
      .eq("is_family_favorite", true)
      .order("updated_at", { ascending: false }),
  ]);

  return {
    personal: personalResult.data ?? [],
    family: familyResult.data ?? [],
  };
}

// -------------------------------------------------------
// GET PUBLIC RECIPES (for Discover)
// -------------------------------------------------------
export async function getPublicRecipes(limit = 20) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return [];
  }

  const supabase = createAdminClient();

  const { data } = await supabase
    .from("recipes")
    .select(`*, family_members ( id, name, photo_url, country_of_origin )`)
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

// -------------------------------------------------------
// GET PUBLIC RECIPES FOR A SPECIFIC FAMILY
// -------------------------------------------------------
export async function getPublicFamilyRecipes(familyId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("recipes")
    .select("*")
    .eq("family_id", familyId)
    .eq("visibility", "public")
    .order("title", { ascending: true });
  return data ?? [];
}

// -------------------------------------------------------
// ADD MEMORY TO RECIPE
// -------------------------------------------------------
export async function addMemory(recipeId: string, input: { text?: string; occasion?: string; meaning_note?: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("memories")
    .insert({ ...input, recipe_id: recipeId, created_by: user.id })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/recipes/${recipeId}`);
  return { memory: data };
}
