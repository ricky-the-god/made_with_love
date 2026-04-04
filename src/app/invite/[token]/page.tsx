import { redirect } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { acceptFamilyInvitation } from "@/server/family-actions";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/v2/login?redirect=/invite/${token}`);
  }

  const result = await acceptFamilyInvitation(token);

  if ("error" in result) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-amber-50/30 p-6 dark:bg-background">
        <div className="w-full max-w-md">
          <Card className="border-amber-100 shadow-sm dark:border-amber-900/20">
            <CardContent className="flex flex-col items-center gap-6 pt-10 pb-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                <span className="text-2xl">✕</span>
              </div>
              <div>
                <h1 className="font-bold text-2xl">Invite not valid</h1>
                <p className="mt-2 text-muted-foreground leading-relaxed">{result.error}</p>
              </div>
              <div className="flex w-full flex-col gap-3">
                <Button asChild className="w-full bg-amber-700 text-white hover:bg-amber-800">
                  <a href="/onboarding">
                    <ArrowLeft className="size-4" />
                    Back to onboarding
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href="/">Go home</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  redirect("/dashboard/tree");
}
