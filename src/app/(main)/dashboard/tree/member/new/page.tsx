import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { NewMemberForm } from "./_components/new-member-form";

export default function NewMemberPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <a href="/dashboard/tree">
            <ArrowLeft className="size-4" />
          </a>
        </Button>
        <div>
          <h1 className="font-semibold text-2xl">Add Family Member</h1>
          <p className="text-muted-foreground text-sm">Create a profile for someone special in your family.</p>
        </div>
      </div>

      <NewMemberForm />
    </div>
  );
}
