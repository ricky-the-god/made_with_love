"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { Check, UserMinus, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { addFamilyConnection, removeFamilyConnection } from "@/server/family-actions";

interface FriendButtonProps {
  familyId: string;
  isConnected: boolean;
}

export function FriendButton({ familyId, isConnected }: FriendButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      if (isConnected) {
        await removeFamilyConnection(familyId);
      } else {
        await addFamilyConnection(familyId);
      }
      router.refresh();
    });
  }

  if (isConnected) {
    return (
      <Button variant="outline" onClick={handleToggle} disabled={isPending} className="gap-2">
        {isPending ? <UserMinus className="size-4" /> : <Check className="size-4 text-green-600" />}
        {isPending ? "Removing…" : "Friend added"}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleToggle}
      disabled={isPending}
      className="gap-2 bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
    >
      <UserPlus className="size-4" />
      {isPending ? "Adding…" : "Add to friends"}
    </Button>
  );
}
