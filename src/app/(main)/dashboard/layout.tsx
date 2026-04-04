import type { ReactNode } from "react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/app/(main)/dashboard/_components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ONBOARDING_SKIPPED_COOKIE } from "@/lib/cookies";
import { SIDEBAR_COLLAPSIBLE_VALUES, SIDEBAR_VARIANT_VALUES } from "@/lib/preferences/layout";
import { cn } from "@/lib/utils";
import { getProfile } from "@/server/family-actions";
import { getPreference } from "@/server/server-actions";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const [profile, cookieStore] = await Promise.all([getProfile(), cookies()]);
  if (!profile) redirect("/auth/v2/login");
  if (!profile.family_id) {
    const skipped = cookieStore.get(ONBOARDING_SKIPPED_COOKIE)?.value;
    if (!skipped) redirect("/onboarding");
  }

  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";
  const [variant, collapsible] = await Promise.all([
    getPreference("sidebar_variant", SIDEBAR_VARIANT_VALUES, "inset"),
    getPreference("sidebar_collapsible", SIDEBAR_COLLAPSIBLE_VALUES, "icon"),
  ]);
  const displayName = profile.full_name?.trim() || profile.email?.split("@")[0] || "My Account";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar
        variant={variant}
        collapsible={collapsible}
        user={{
          name: displayName,
          email: profile.email ?? "",
          avatarUrl: profile.avatar_url ?? null,
        }}
      />
      <SidebarInset
        className={cn(
          "[html[data-content-layout=centered]_&]:mx-auto! [html[data-content-layout=centered]_&]:max-w-screen-2xl!",
          // Adds right margin for inset sidebar in centered layout up to 113rem.
          // On wider screens with collapsed sidebar, removes margin and sets margin auto for alignment.
          "max-[113rem]:peer-data-[variant=inset]:mr-2! min-[101rem]:peer-data-[variant=inset]:peer-data-[state=collapsed]:mr-auto!",
        )}
      >
        <div className="h-full p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
