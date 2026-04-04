import { BookOpen, Trees, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getConnectedFamilies, getFamily } from "@/server/family-actions";

import { ShareFamilyLinkButton } from "../profile/family/_components/share-family-link-button";
import { AddFriendForm } from "./_components/add-friend-form";

export default async function FriendsPage() {
  const [connections, family] = await Promise.all([getConnectedFamilies(), getFamily()]);

  // connections rows include families(id, family_name, privacy_setting) joined
  type Connection = (typeof connections)[number] & {
    families: { id: string; family_name: string; privacy_setting: string } | null;
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <div>
        <h1 className="font-semibold text-2xl">Friends</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Browse family trees and recipes from families you're connected with.
        </p>
      </div>

      {/* Connected families */}
      {connections.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-200 border-dashed bg-amber-50/30 py-16 dark:border-amber-900/30 dark:bg-amber-950/10">
          <Users className="mb-3 size-10 text-amber-300" />
          <p className="font-medium">No friends added yet</p>
          <p className="mt-1 max-w-xs text-center text-muted-foreground text-sm">
            Paste a family share link below to connect with another family's cookbook.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {(connections as Connection[]).map((conn) => {
            const family = conn.families;
            if (!family) return null;
            return (
              <a
                key={conn.id}
                href={`/dashboard/discover/family/${family.id}`}
                className="group block rounded-2xl border border-amber-100 bg-amber-50/30 p-5 transition-shadow hover:border-amber-300 hover:shadow-md dark:border-amber-900/20 dark:bg-amber-950/10 dark:hover:border-amber-800/40"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                    <Trees className="size-5 text-amber-700 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate font-semibold group-hover:text-amber-800 dark:group-hover:text-amber-300">
                      {family.family_name}
                    </p>
                    <p className="mt-0.5 text-muted-foreground text-xs">Public family</p>
                  </div>
                  <BookOpen className="size-4 shrink-0 text-amber-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </a>
            );
          })}
        </div>
      )}

      <Separator />

      {/* Your family share link */}
      {family && (
        <Card className="border-amber-100 dark:border-amber-900/20">
          <CardHeader>
            <CardTitle className="text-base">Your family link</CardTitle>
            <CardDescription>Share this with friends so they can add your family.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-amber-100 bg-amber-50/50 px-3 py-2 dark:border-amber-900/20 dark:bg-amber-950/10">
              <span className="flex-1 break-all font-mono text-muted-foreground text-xs">{family.id}</span>
              {family.privacy_setting === "public" ? (
                <ShareFamilyLinkButton familyId={family.id} />
              ) : (
                <span className="shrink-0 text-muted-foreground text-xs">Set to Public to share</span>
              )}
            </div>
            {family.privacy_setting !== "public" && (
              <p className="text-muted-foreground text-xs">
                Your family is currently private.{" "}
                <a href="/dashboard/profile/family" className="text-amber-700 hover:underline dark:text-amber-400">
                  Go to Family Management
                </a>{" "}
                to make it public so friends can view your tree.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add friend form */}
      <Card className="border-amber-100 dark:border-amber-900/20">
        <CardHeader>
          <CardTitle className="text-base">Add a friend family</CardTitle>
          <CardDescription>Paste a share link or family ID from a friend.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddFriendForm />
        </CardContent>
      </Card>
    </div>
  );
}
