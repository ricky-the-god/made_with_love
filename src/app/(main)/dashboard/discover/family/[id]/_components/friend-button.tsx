"use client";

import { useState, useTransition } from "react";

import { Check, UserMinus, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { addFamilyConnection, removeFamilyConnection } from "@/server/family-actions";

interface FriendButtonProps {
  familyId: string;
  isConnected: boolean;
}

export function FriendButton({ familyId, isConnected: initialConnected }: FriendButtonProps) {
  const [connected, setConnected] = useState(initialConnected);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    setError(null);
    const next = !connected;
    setConnected(next); // optimistic

    startTransition(async () => {
      const result = next ? await addFamilyConnection(familyId) : await removeFamilyConnection(familyId);

      if (result && "error" in result && result.error) {
        setConnected(!next); // revert
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      {connected ? (
        <Button variant="outline" onClick={handleToggle} disabled={isPending} className="gap-2">
          {isPending ? <UserMinus className="size-4" /> : <Check className="size-4 text-green-600" />}
          {isPending ? "Removing…" : "Friend added"}
        </Button>
      ) : (
        <Button
          onClick={handleToggle}
          disabled={isPending}
          className="gap-2 bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
        >
          <UserPlus className="size-4" />
          {isPending ? "Adding…" : "Add to friends"}
        </Button>
      )}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
