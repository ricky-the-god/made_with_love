import { notFound } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getFamilyMember, getFamilyMembers } from "@/server/family-actions";

import { EditMemberForm } from "./_components/edit-member-form";

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [member, members] = await Promise.all([getFamilyMember(id), getFamilyMembers()]);

  if (!member) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <a href={`/dashboard/tree/member/${id}`}>
            <ArrowLeft className="size-4" />
          </a>
        </Button>
        <div>
          <h1 className="font-semibold text-2xl">Edit Family Member</h1>
          <p className="text-muted-foreground text-sm">Update this person's profile details.</p>
        </div>
      </div>

      <EditMemberForm member={member} members={members} />
    </div>
  );
}
