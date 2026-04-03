import { ArrowLeft, Clock, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getFamily, getPendingInvitations } from "@/server/family-actions";

import { CopyInviteLinkButton } from "./_components/copy-invite-link-button";
import { CreateFamilyForm } from "./_components/create-family-form";
import { InviteMemberButton } from "./_components/invite-member-button";
import { ManageFamilyForm } from "./_components/manage-family-form";
import { ShareFamilyLinkButton } from "./_components/share-family-link-button";
import { TogglePrivacyButton } from "./_components/toggle-privacy-button";

export default async function FamilyManagementPage() {
  const [family, pendingInvitations] = await Promise.all([getFamily(), getPendingInvitations()]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <a href="/dashboard/profile">
            <ArrowLeft className="size-4" />
          </a>
        </Button>
        <div>
          <h1 className="font-semibold text-2xl">Family Management</h1>
          <p className="text-muted-foreground text-sm">Manage your family space and collaborators.</p>
        </div>
      </div>

      {family === null ? (
        /* ── State A: no family yet ── */
        <Card className="border-amber-100 dark:border-amber-900/20">
          <CardHeader>
            <CardTitle className="text-base">Create your family space</CardTitle>
            <CardDescription>You don't have a family space yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateFamilyForm />
          </CardContent>
        </Card>
      ) : (
        /* ── State B: family exists ── */
        <>
          {/* Family name + privacy */}
          <Card className="border-amber-100 dark:border-amber-900/20">
            <CardHeader>
              <CardTitle className="text-base">Family Space</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <ManageFamilyForm familyId={family.id} currentName={family.family_name} />

              <div className="flex flex-col gap-2">
                <span className="font-medium text-sm">Privacy</span>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                    >
                      {family.privacy_setting === "public" ? "Public" : "Private"}
                    </Badge>
                    <p className="text-muted-foreground text-xs">
                      {family.privacy_setting === "public"
                        ? "Anyone with the link can view your tree and public recipes."
                        : "Only family members can see your archive."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {family.privacy_setting === "public" && <ShareFamilyLinkButton familyId={family.id} />}
                    <TogglePrivacyButton familyId={family.id} currentSetting={family.privacy_setting} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Members */}
          <Card className="border-amber-100 dark:border-amber-900/20">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="text-base">Members</CardTitle>
                <CardDescription>Invite family members to contribute recipes and memories.</CardDescription>
              </div>
              <InviteMemberButton />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col items-center justify-center rounded-xl border border-amber-200 border-dashed py-8 dark:border-amber-900/30">
                <Users className="mb-2 size-8 text-amber-300" />
                <p className="text-muted-foreground text-sm">Only you are in this family space so far.</p>
              </div>

              {pendingInvitations.length > 0 && (
                <div className="flex flex-col gap-3">
                  <p className="font-medium text-sm">Pending invitations</p>
                  {pendingInvitations.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex flex-col gap-2 rounded-lg border border-amber-100 bg-amber-50/40 p-3 dark:border-amber-900/20 dark:bg-amber-950/10"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm">{inv.email}</span>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                          <Clock className="size-3" />
                          Expires {new Date(inv.expires_at).toLocaleDateString()}
                        </div>
                      </div>
                      <CopyInviteLinkButton token={inv.token} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
