"use server";

import { redirect } from "next/navigation";

import { createAdminClient, createClient } from "@/lib/supabase/server";

function validateNewPassword(newPassword: string, confirmPassword: string) {
  if (newPassword.length < 8) {
    return "Your new password must be at least 8 characters long.";
  }

  if (newPassword !== confirmPassword) {
    return "Your new password and confirmation do not match.";
  }

  return null;
}

export async function loginWithEmail(email: string, password: string, redirectTo?: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  // Only allow relative paths to prevent open redirect attacks
  const safeRedirect = redirectTo?.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/dashboard";
  redirect(safeRedirect);
}

export async function registerWithEmail(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  // Supabase sends a confirmation email by default.
  // Redirect to login so the user can confirm before signing in.
  redirect("/auth/v2/login");
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/v2/login");
}

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function updatePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
  const validationError = validateNewPassword(newPassword, confirmPassword);

  if (validationError) {
    return { error: validationError };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "You must be signed in to change your password." };
  }

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (verifyError) {
    return { error: "Your current password is incorrect." };
  }

  const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

  if (updateError) {
    return { error: updateError.message };
  }

  return { success: true };
}

export async function signOutOtherSessions() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to manage active sessions." };
  }

  const { error } = await supabase.auth.signOut({ scope: "others" });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function deleteAccount() {
  const supabase = await createClient();
  const admin = createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to delete your account." };
  }

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, family_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return { error: "We could not load your account details." };
  }

  let transferOwnerId: string | null = null;

  if (profile.family_id) {
    const { data: family, error: familyError } = await admin
      .from("families")
      .select("id, owner_id")
      .eq("id", profile.family_id)
      .maybeSingle();

    if (familyError) {
      return { error: familyError.message };
    }

    if (family) {
      if (family.owner_id === user.id) {
        const [
          { data: otherProfiles, error: otherProfilesError },
          { data: pendingInvitations, error: invitationsError },
        ] = await Promise.all([
          admin.from("profiles").select("id").eq("family_id", family.id).neq("id", user.id),
          admin
            .from("family_invitations")
            .select("id")
            .eq("family_id", family.id)
            .is("accepted_at", null)
            .gt("expires_at", new Date().toISOString()),
        ]);

        if (otherProfilesError) {
          return { error: otherProfilesError.message };
        }

        if (invitationsError) {
          return { error: invitationsError.message };
        }

        if ((otherProfiles?.length ?? 0) > 0 || (pendingInvitations?.length ?? 0) > 0) {
          return {
            error:
              "This account still owns a family with other members or pending invitations. Remove them first before deleting your account.",
          };
        }
      } else {
        transferOwnerId = family.owner_id;
      }
    }
  }

  if (transferOwnerId) {
    const cleanupResults = await Promise.all([
      admin.from("family_members").update({ created_by: transferOwnerId }).eq("created_by", user.id),
      admin.from("recipes").update({ created_by: transferOwnerId }).eq("created_by", user.id),
      admin.from("memories").update({ created_by: transferOwnerId }).eq("created_by", user.id),
      admin.from("family_invitations").update({ invited_by: transferOwnerId }).eq("invited_by", user.id),
      admin.from("family_connections").delete().eq("user_id", user.id),
    ]);

    const cleanupError = cleanupResults.find((result) => result.error)?.error;

    if (cleanupError) {
      return { error: cleanupError.message };
    }
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);

  if (deleteError) {
    return { error: deleteError.message };
  }

  await supabase.auth.signOut({ scope: "local" });

  return { success: true };
}
