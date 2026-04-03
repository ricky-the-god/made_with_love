"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAdminClient, createClient } from "@/lib/supabase/server";

// -------------------------------------------------------
// GET CURRENT USER'S PROFILE
// -------------------------------------------------------
export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return data;
}

// -------------------------------------------------------
// CREATE FAMILY
// Called from onboarding step 2.
// Creates the family, then links the user's profile to it.
// -------------------------------------------------------
export async function createFamily(familyName: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  const { data: family, error: familyError } = await admin
    .from("families")
    .insert({ family_name: familyName.trim(), owner_id: user.id })
    .select()
    .single();

  if (familyError) return { error: familyError.message };

  const { error: profileError } = await admin
    .from("profiles")
    .update({ family_id: family.id, role: "owner" })
    .eq("id", user.id);

  if (profileError) return { error: profileError.message };

  revalidatePath("/dashboard");
  return { family };
}

// -------------------------------------------------------
// GET CURRENT USER'S FAMILY
// -------------------------------------------------------
export async function getFamily() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("family_id").eq("id", user.id).single();

  if (!profile?.family_id) return null;

  const { data } = await supabase.from("families").select("*").eq("id", profile.family_id).single();

  return data;
}

// -------------------------------------------------------
// UPDATE FAMILY
// -------------------------------------------------------
export async function updateFamily(familyId: string, updates: { family_name?: string; privacy_setting?: string }) {
  const supabase = await createClient();

  const { error } = await supabase.from("families").update(updates).eq("id", familyId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/profile/family");
  return { success: true };
}

// -------------------------------------------------------
// GET FAMILY MEMBERS
// -------------------------------------------------------
export async function getFamilyMembers() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: profile } = await supabase.from("profiles").select("family_id").eq("id", user.id).single();

  if (!profile?.family_id) return [];

  const { data } = await supabase
    .from("family_members")
    .select("*")
    .eq("family_id", profile.family_id)
    .order("generation", { ascending: true })
    .order("name", { ascending: true });

  return data ?? [];
}

// -------------------------------------------------------
// GET SINGLE FAMILY MEMBER
// -------------------------------------------------------
export async function getFamilyMember(memberId: string) {
  const supabase = await createClient();

  const { data } = await supabase.from("family_members").select("*").eq("id", memberId).single();

  return data;
}

// -------------------------------------------------------
// CREATE FAMILY MEMBER
// -------------------------------------------------------
export async function createFamilyMember(input: {
  name: string;
  relation?: string;
  generation?: number;
  parent_ids?: string[];
  bio?: string;
  country_of_origin?: string;
  cultural_background?: string;
  birth_year?: number;
  is_memorial?: boolean;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data: profile } = await supabase.from("profiles").select("family_id").eq("id", user.id).single();

  if (!profile?.family_id) return { error: "No family found. Create a family first." };

  const { data, error } = await supabase
    .from("family_members")
    .insert({
      ...input,
      family_id: profile.family_id,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/tree");
  return { member: data };
}

// -------------------------------------------------------
// UPDATE FAMILY MEMBER
// -------------------------------------------------------
export async function updateFamilyMember(
  memberId: string,
  updates: {
    name?: string;
    relation?: string;
    generation?: number;
    parent_ids?: string[];
    bio?: string;
    country_of_origin?: string;
    cultural_background?: string;
    birth_year?: number;
    is_memorial?: boolean;
    photo_url?: string;
  },
) {
  const supabase = await createClient();

  const { error } = await supabase.from("family_members").update(updates).eq("id", memberId);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/tree/member/${memberId}`);
  revalidatePath("/dashboard/tree");
  return { success: true };
}

// -------------------------------------------------------
// DELETE FAMILY MEMBER
// -------------------------------------------------------
export async function deleteFamilyMember(memberId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("family_members").delete().eq("id", memberId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/tree");
  redirect("/dashboard/tree");
}

// -------------------------------------------------------
// SEND INVITE
// -------------------------------------------------------
export async function sendFamilyInvitation(email: string, role: "editor" | "contributor" | "viewer") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data: family } = await supabase.from("families").select("id").eq("owner_id", user.id).single();

  if (!family) return { error: "Only the family owner can send invitations." };

  const { data, error } = await supabase
    .from("family_invitations")
    .insert({ family_id: family.id, invited_by: user.id, email: email.trim().toLowerCase(), role })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/profile/family");
  return { invitation: data };
}

// -------------------------------------------------------
// GET PENDING INVITATIONS (for owner view)
// -------------------------------------------------------
export async function getPendingInvitations() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("family_invitations")
    .select("*")
    .is("accepted_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });

  return data ?? [];
}

// -------------------------------------------------------
// ACCEPT FAMILY INVITATION
// -------------------------------------------------------
export async function acceptFamilyInvitation(token: string) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Use admin client so RLS on family_invitations doesn't block the lookup
  const { data: invitation } = await admin
    .from("family_invitations")
    .select("*")
    .eq("token", token)
    .is("accepted_at", null)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (!invitation) return { error: "This invite link is invalid or has expired." };

  // Check user doesn't already belong to a family
  const { data: profile } = await supabase.from("profiles").select("family_id").eq("id", user.id).single();

  if (profile?.family_id) return { error: "You already belong to a family space." };

  // Link user to the family with the invited role
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ family_id: invitation.family_id, role: invitation.role })
    .eq("id", user.id);

  if (profileError) return { error: profileError.message };

  // Atomically mark invitation accepted — check count to guard against race conditions
  const { count, error: acceptError } = await admin
    .from("family_invitations")
    .update({ accepted_at: new Date().toISOString() })
    .eq("id", invitation.id)
    .is("accepted_at", null) // only update if still unaccepted
    .select("id", { count: "exact", head: true });

  if (acceptError || count === 0) {
    // Another request already claimed this invite — roll back the profile update
    await supabase.from("profiles").update({ family_id: null, role: null }).eq("id", user.id);
    return { error: "This invite was already used. Please request a new one." };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
