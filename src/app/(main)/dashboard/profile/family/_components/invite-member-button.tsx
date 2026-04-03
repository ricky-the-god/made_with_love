"use client";

import { useState } from "react";

import { Check, Copy, Link, Mail, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendFamilyInvitation } from "@/server/family-actions";

export function InviteMemberButton() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const inviteLink = inviteToken ? `${window.location.origin}/invite/${inviteToken}` : "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;

    setPending(true);
    setError(null);

    const result = await sendFamilyInvitation(email.trim(), "editor");

    if (result && "error" in result && result.error) {
      setError(result.error);
    } else if ("invitation" in result) {
      setInviteToken(result.invitation.token);
    }

    setPending(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setEmail("");
      setError(null);
      setInviteToken(null);
      setCopied(false);
    }
  }

  function handleSendAnother() {
    setEmail("");
    setError(null);
    setInviteToken(null);
    setCopied(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700">
          <UserPlus className="size-4" />
          Invite member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite a family member</DialogTitle>
          <DialogDescription>
            {inviteToken
              ? "Share this link with them — it expires in 7 days."
              : "Enter their email to generate a personal invite link."}
          </DialogDescription>
        </DialogHeader>

        {inviteToken ? (
          /* ── Step 2: show the invite link ── */
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-2">
              <Label>Invite link for {email}</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2.5 size-3.5 text-muted-foreground" />
                  <Input
                    readOnly
                    value={inviteLink}
                    className="cursor-text pl-7 font-mono text-xs"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                </div>
                <Button type="button" variant="outline" className="shrink-0 gap-1.5" onClick={handleCopy}>
                  {copied ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <p className="text-muted-foreground text-xs">
                Send this link directly — they'll need to be signed in (or register first) to accept.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleSendAnother}>
                Invite another
              </Button>
              <Button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="bg-amber-700 text-white hover:bg-amber-800"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          /* ── Step 1: email form ── */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="invite-email">Email address</Label>
              <div className="relative">
                <Mail className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="family@example.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={pending}
                  autoFocus
                />
              </div>
              <p className="text-muted-foreground text-xs">
                After submitting, you'll get a link to share directly with them.
              </p>
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={pending || !email.trim()}
                className="bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
              >
                {pending ? "Creating…" : "Create invite link"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
