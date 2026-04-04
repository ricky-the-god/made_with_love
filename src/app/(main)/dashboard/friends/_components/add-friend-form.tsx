"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addFamilyConnection } from "@/server/family-actions";

// Extract a UUID from a pasted URL like /dashboard/discover/family/[uuid]
// or accept a raw UUID directly
function extractFamilyId(input: string): string | null {
  const trimmed = input.trim();
  // Match UUID pattern anywhere in the string
  const match = trimmed.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  return match ? match[0] : null;
}

export function AddFriendForm() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const familyId = extractFamilyId(value);
    if (!familyId) {
      setMessage({ type: "error", text: "Could not find a valid family ID in that link." });
      return;
    }

    setPending(true);
    setMessage(null);

    const result = await addFamilyConnection(familyId);

    if (result && "error" in result && result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Friend added!" });
      setValue("");
      router.refresh();
    }

    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Label htmlFor="friend-link">Paste a family share link or family ID</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />
          <Input
            id="friend-link"
            placeholder="https://… or paste a family ID"
            className="pl-9"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setMessage(null);
            }}
            disabled={pending}
          />
        </div>
        <Button
          type="submit"
          disabled={pending || !value.trim()}
          className="shrink-0 bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
        >
          {pending ? "Adding…" : "Add friend"}
        </Button>
      </div>
      {message && (
        <p
          className={
            message.type === "success" ? "text-amber-700 text-sm dark:text-amber-400" : "text-destructive text-sm"
          }
        >
          {message.text}
        </p>
      )}
      <p className="text-muted-foreground text-xs">
        Ask your friend to share their family link from their Family Management page (the family must be set to Public).
      </p>
    </form>
  );
}
