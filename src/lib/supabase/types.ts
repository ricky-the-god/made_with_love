// Auto-maintained types matching supabase/migrations/001_initial_schema.sql
// Update this file whenever the schema changes.

export type UserRole = "owner" | "editor" | "contributor" | "viewer";
export type PrivacySetting = "private" | "public";
export type RecipeVisibility = "private" | "family" | "public";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  family_id: string | null;
  role: UserRole | null;
  pref_recipes_private_by_default: boolean;
  pref_show_in_discover: boolean;
  pref_show_memorial_public: boolean;
  pref_notify_invitations: boolean;
  pref_notify_new_recipe: boolean;
  pref_notify_new_memory: boolean;
  created_at: string;
  updated_at: string;
}

export interface Family {
  id: string;
  family_name: string;
  owner_id: string;
  privacy_setting: PrivacySetting;
  created_at: string;
  updated_at: string;
}

export interface FamilyMember {
  id: string;
  family_id: string;
  name: string;
  relation: string | null;
  generation: number | null;
  parent_ids: string[];
  photo_url: string | null;
  bio: string | null;
  country_of_origin: string | null;
  cultural_background: string | null;
  birth_year: number | null;
  is_memorial: boolean;
  linked_user_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  family_id: string;
  member_id: string | null;
  created_by: string;
  title: string;
  description: string | null;
  ingredients: string | null;
  steps: string | null;
  notes: string | null;
  prep_time: string | null;
  cook_time: string | null;
  servings: string | null;
  country_of_origin: string | null;
  culture_tag: string | null;
  occasion: string | null;
  language: string;
  image_url: string | null;
  is_favorite: boolean;
  is_family_favorite: boolean;
  visibility: RecipeVisibility;
  created_at: string;
  updated_at: string;
}

export interface Memory {
  id: string;
  recipe_id: string;
  created_by: string;
  text: string | null;
  voice_note_url: string | null;
  photo_url: string | null;
  occasion: string | null;
  meaning_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface AiOutput {
  id: string;
  recipe_id: string;
  source_image_url: string | null;
  extracted_text: string | null;
  structured_recipe: Record<string, unknown> | null;
  guided_steps: Record<string, unknown>[] | null;
  translation_output: Record<string, unknown> | null;
  confidence_note: string | null;
  model_used: string | null;
  created_at: string;
}

export interface FamilyInvitation {
  id: string;
  family_id: string;
  invited_by: string;
  email: string;
  role: Exclude<UserRole, "owner">;
  token: string;
  accepted_at: string | null;
  expires_at: string;
  created_at: string;
}

export interface FamilyConnection {
  id: string;
  user_id: string;
  family_id: string;
  created_at: string;
}

// -------------------------------------------------------
// Joined / enriched types used in the UI
// -------------------------------------------------------

export type RecipeWithMember = Recipe & {
  family_members: Pick<FamilyMember, "id" | "name" | "photo_url" | "relation"> | null;
};

export type FamilyMemberWithRecipeCount = FamilyMember & {
  recipe_count: number;
};

// -------------------------------------------------------
// Supabase Database helper type
// Matches the shape expected by createClient<Database>()
// Extend as tables are added.
// -------------------------------------------------------
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, "created_at" | "updated_at">; Update: Partial<Profile> };
      families: { Row: Family; Insert: Omit<Family, "id" | "created_at" | "updated_at">; Update: Partial<Family> };
      family_members: {
        Row: FamilyMember;
        Insert: Omit<FamilyMember, "id" | "created_at" | "updated_at">;
        Update: Partial<FamilyMember>;
      };
      recipes: { Row: Recipe; Insert: Omit<Recipe, "id" | "created_at" | "updated_at">; Update: Partial<Recipe> };
      memories: { Row: Memory; Insert: Omit<Memory, "id" | "created_at" | "updated_at">; Update: Partial<Memory> };
      ai_outputs: { Row: AiOutput; Insert: Omit<AiOutput, "id" | "created_at">; Update: Partial<AiOutput> };
      family_invitations: {
        Row: FamilyInvitation;
        Insert: Omit<FamilyInvitation, "id" | "token" | "created_at">;
        Update: Partial<FamilyInvitation>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      privacy_setting: PrivacySetting;
      recipe_visibility: RecipeVisibility;
    };
  };
}
