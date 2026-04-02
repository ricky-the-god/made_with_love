"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendFamilyInvitation, updateFamily } from "@/server/family-actions";

interface ManageFamilyFormProps {
  familyId: string;
  currentName: string;
}

export function ManageFamilyForm({ familyId, currentName }: ManageFamilyFormProps) {
  const router = useRouter();

  // Family name section
  const [familyName, setFamilyName] = useState(currentName);
  const [savingName, setSavingName] = useState(false);
  const [nameMessage, setNameMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Invite section
  const [inviteEmail, setInviteEmail] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);
  const [inviteMessage, setInviteMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSaveName(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!familyName.trim()) return;

    setSavingName(true);
    setNameMessage(null);

    const result = await updateFamily(familyId, { family_name: familyName.trim() });

    if (result && "error" in result && result.error) {
      setNameMessage({ type: "error", text: result.error });
    } else {
      setNameMessage({ type: "success", text: "Family name saved." });
      router.refresh();
    }

    setSavingName(false);
  }

  async function handleInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setSendingInvite(true);
    setInviteMessage(null);

    const result = await sendFamilyInvitation(inviteEmail.trim(), "editor");

    if (result && "error" in result && result.error) {
      setInviteMessage({ type: "error", text: result.error });
    } else {
      setInviteMessage({ type: "success", text: "Invitation sent." });
      setInviteEmail("");
    }

    setSendingInvite(false);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Family name */}
      <form onSubmit={handleSaveName} className="flex flex-col gap-2">
        <Label htmlFor="family-name">Family name</Label>
        <div className="flex gap-2">
          <Input
            id="family-name"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            disabled={savingName}
          />
          <Button type="submit" variant="outline" disabled={savingName || !familyName.trim()}>
            {savingName ? "Saving…" : "Save"}
          </Button>
        </div>
        {nameMessage && (
          <p
            className={
              nameMessage.type === "success" ? "text-amber-700 text-sm dark:text-amber-400" : "text-destructive text-sm"
            }
          >
            {nameMessage.text}
          </p>
        )}
      </form>

      {/* Invite */}
      <form onSubmit={handleInvite} className="flex flex-col gap-2">
        <Label htmlFor="invite">Invite by email</Label>
        <div className="flex gap-2">
          <Input
            id="invite"
            type="email"
            placeholder="family@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            disabled={sendingInvite}
          />
          <Button
            type="submit"
            disabled={sendingInvite || !inviteEmail.trim()}
            className="shrink-0 bg-amber-700 text-white hover:bg-amber-800"
          >
            <Plus className="size-4" />
            {sendingInvite ? "Sending…" : "Invite"}
          </Button>
        </div>
        <p className="text-muted-foreground text-xs">Invited members can view and contribute to your family archive.</p>
        {inviteMessage && (
          <p
            className={
              inviteMessage.type === "success"
                ? "text-amber-700 text-sm dark:text-amber-400"
                : "text-destructive text-sm"
            }
          >
            {inviteMessage.text}
          </p>
        )}
      </form>
    </div>
  );
}
