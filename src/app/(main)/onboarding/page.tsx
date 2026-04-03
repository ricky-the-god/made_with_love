"use client";

import { useEffect, useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, ArrowRight, Clock, Heart, TreeDeciduous, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  acceptFamilyInvitation,
  createFamily,
  createFamilyMember,
  getMyPendingInvitations,
  skipOnboarding,
} from "@/server/family-actions";

type PendingInvitation = Awaited<ReturnType<typeof getMyPendingInvitations>>[number];

export default function OnboardingPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"choose" | "create" | "join" | null>(null);
  const [step, setStep] = useState(0);
  const [familyName, setFamilyName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [pendingInvites, setPendingInvites] = useState<PendingInvitation[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(false);

  useEffect(() => {
    if (mode === "join") {
      setLoadingInvites(true);
      getMyPendingInvitations()
        .then(setPendingInvites)
        .finally(() => setLoadingInvites(false));
    }
  }, [mode]);

  // Progress calculation
  let progress = 0;
  if (mode === "create") progress = (step / 3) * 100;
  else if (mode === "join") progress = 50;

  function resetToWelcome() {
    setMode(null);
    setStep(0);
    setError(null);
  }

  function handleSkip() {
    startTransition(async () => {
      await skipOnboarding();
      router.push("/dashboard/tree");
    });
  }

  function handleAcceptInvite(token: string) {
    setError(null);
    startTransition(async () => {
      const result = await acceptFamilyInvitation(token);
      if ("error" in result && result.error) {
        setError(result.error);
      } else {
        router.refresh();
        router.push("/dashboard/tree");
      }
    });
  }

  function handleJoinSubmit() {
    const raw = inviteCode.trim();
    if (!raw) {
      setError("Please enter your invite code.");
      return;
    }
    // Support pasting a full invite URL — extract the token from the path
    let token = raw;
    try {
      const url = new URL(raw);
      const parts = url.pathname.split("/").filter(Boolean);
      const inviteIdx = parts.indexOf("invite");
      if (inviteIdx !== -1 && parts[inviteIdx + 1]) {
        token = parts[inviteIdx + 1];
      }
    } catch {
      // raw is not a URL, use as-is
    }
    setError(null);
    startTransition(async () => {
      const result = await acceptFamilyInvitation(token);
      if ("error" in result && result.error) {
        setError(result.error);
      } else {
        router.refresh();
        router.push("/dashboard/tree");
      }
    });
  }

  function handleCreateContinue() {
    setError(null);
    if (step === 1) {
      if (!familyName.trim()) {
        setError("Please enter a name for your family space.");
        return;
      }
      startTransition(async () => {
        const result = await createFamily(familyName.trim());
        if (result?.error) {
          setError(result.error);
        } else {
          setStep(2);
        }
      });
    } else if (step === 2) {
      if (!memberName.trim()) {
        setError("Please enter a name for this family member.");
        return;
      }
      startTransition(async () => {
        const result = await createFamilyMember({ name: memberName.trim() });
        if (result?.error) {
          setError(result.error);
        } else {
          setStep(3);
        }
      });
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-amber-50/30 p-6 dark:bg-background">
      <div className="w-full max-w-md">
        {/* Progress bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-1" />
          {mode !== null && (
            <p className="mt-2 text-center text-muted-foreground text-xs">
              {mode === "create" && step > 0 && step < 3 && `Step ${step} of 3`}
              {mode === "create" && step === 3 && "All done"}
              {mode === "join" && "Join a family tree"}
            </p>
          )}
        </div>

        {/* Welcome — step 0, no mode chosen */}
        {mode === null && (
          <Card className="border-amber-100 shadow-sm dark:border-amber-900/20">
            <CardContent className="flex flex-col items-center gap-6 pt-10 pb-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                <Heart className="size-8" />
              </div>
              <div>
                <h1 className="font-bold text-2xl">Welcome to Made with Love</h1>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  A living archive for your family's recipes, stories, and traditions.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3">
                <Button
                  onClick={() => {
                    setMode("create");
                    setStep(1);
                  }}
                  className="w-full bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
                >
                  Create a new family tree
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMode("join");
                    setStep(1);
                  }}
                  className="w-full border-amber-200 dark:border-amber-800"
                >
                  Join an existing tree
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  disabled={isPending}
                  className="text-muted-foreground"
                >
                  Skip for now, I'll join a family later
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create flow — Step 1: name the family */}
        {mode === "create" && step === 1 && (
          <Card className="border-amber-100 shadow-sm dark:border-amber-900/20">
            <CardContent className="flex flex-col items-center gap-6 pt-10 pb-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                <Users className="size-8" />
              </div>
              <div>
                <h1 className="font-bold text-2xl">Name your family space</h1>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Give your family archive a name. You can change this anytime.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 text-left">
                <Label htmlFor="family-name">Family name</Label>
                <Input
                  id="family-name"
                  placeholder="e.g. The Nguyen Family"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateContinue()}
                  className="text-center"
                  disabled={isPending}
                  autoFocus
                />
                {error && <p className="text-destructive text-sm">{error}</p>}
              </div>
              <div className="flex w-full flex-col gap-3">
                <Button
                  onClick={handleCreateContinue}
                  disabled={isPending}
                  className="w-full bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
                >
                  {isPending ? "Creating…" : "Continue"}
                  {!isPending && <ArrowRight className="size-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={resetToWelcome} className="text-muted-foreground">
                  <ArrowLeft className="mr-1 size-3" />
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create flow — Step 2: add first member */}
        {mode === "create" && step === 2 && (
          <Card className="border-amber-100 shadow-sm dark:border-amber-900/20">
            <CardContent className="flex flex-col items-center gap-6 pt-10 pb-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                <TreeDeciduous className="size-8" />
              </div>
              <div>
                <h1 className="font-bold text-2xl">Add your first family member</h1>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Start with yourself, a grandparent, or whoever you're here to honour.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 text-left">
                <Label htmlFor="member-name">Their name</Label>
                <Input
                  id="member-name"
                  placeholder="e.g. Grandma Rosa"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateContinue()}
                  disabled={isPending}
                  autoFocus
                />
                {error && <p className="text-destructive text-sm">{error}</p>}
              </div>
              <div className="flex w-full flex-col gap-3">
                <Button
                  onClick={handleCreateContinue}
                  disabled={isPending}
                  className="w-full bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
                >
                  {isPending ? "Saving…" : "Continue"}
                  {!isPending && <ArrowRight className="size-4" />}
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href="/dashboard/tree">Skip for now</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create flow — Step 3: done */}
        {mode === "create" && step === 3 && (
          <Card className="border-amber-100 shadow-sm dark:border-amber-900/20">
            <CardContent className="flex flex-col items-center gap-6 pt-10 pb-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                <Heart className="size-8" />
              </div>
              <div>
                <h1 className="font-bold text-2xl">Your family tree is ready</h1>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Tap any person in your tree to add their recipes and stories.
                </p>
              </div>
              <Button
                asChild
                className="w-full bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
              >
                <a href="/dashboard/tree">
                  <TreeDeciduous className="size-4" />
                  Open my family tree
                </a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Join flow — Step 1: pending invites + code entry */}
        {mode === "join" && step === 1 && (
          <Card className="border-amber-100 shadow-sm dark:border-amber-900/20">
            <CardContent className="flex flex-col items-center gap-6 pt-10 pb-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                <Users className="size-8" />
              </div>
              <div>
                <h1 className="font-bold text-2xl">Join a family tree</h1>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Accept a pending invitation or paste your invite code below.
                </p>
              </div>

              {/* Pending invitations for this user's email */}
              {loadingInvites && <p className="text-muted-foreground text-sm">Checking for invitations…</p>}
              {!loadingInvites && pendingInvites.length > 0 && (
                <div className="flex w-full flex-col gap-2">
                  <p className="text-left font-medium text-sm">Your invitations</p>
                  {pendingInvites.map((inv) => {
                    const family = Array.isArray(inv.families) ? inv.families[0] : inv.families;
                    return (
                      <div
                        key={inv.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-amber-100 bg-amber-50/40 p-3 text-left dark:border-amber-900/20 dark:bg-amber-950/10"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-sm">{family?.family_name ?? "Family invite"}</p>
                          <div className="mt-0.5 flex items-center gap-1.5 text-muted-foreground text-xs">
                            <Badge variant="secondary" className="h-4 px-1 text-xs capitalize">
                              {inv.role}
                            </Badge>
                            <Clock className="size-3" />
                            Expires {new Date(inv.expires_at).toLocaleDateString()}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAcceptInvite(inv.token)}
                          disabled={isPending}
                          className="shrink-0 bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
                        >
                          Accept
                        </Button>
                      </div>
                    );
                  })}
                  <div className="relative mt-2 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground text-xs">or enter a code</span>
                  </div>
                </div>
              )}

              <div className="flex w-full flex-col gap-2 text-left">
                <Label htmlFor="invite-code">Invite code or link</Label>
                <Input
                  id="invite-code"
                  placeholder="Paste your invite code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleJoinSubmit()}
                  disabled={isPending}
                  autoFocus={pendingInvites.length === 0}
                />
                {error && <p className="text-destructive text-sm">{error}</p>}
              </div>
              <div className="flex w-full flex-col gap-3">
                <Button
                  onClick={handleJoinSubmit}
                  disabled={isPending}
                  className="w-full bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
                >
                  {isPending ? "Joining…" : "Join with code"}
                  {!isPending && <ArrowRight className="size-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={resetToWelcome} className="text-muted-foreground">
                  <ArrowLeft className="mr-1 size-3" />
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
