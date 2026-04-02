"use client";

import { siGoogle } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signInWithGoogle } from "@/server/auth-actions";

export function GoogleButton({ className, ...props }: Omit<React.ComponentProps<typeof Button>, "onClick">) {
  return (
    <Button
      variant="secondary"
      className={cn(className)}
      onClick={async () => {
        await signInWithGoogle();
      }}
      {...props}
    >
      <SimpleIcon icon={siGoogle} className="size-4" />
      Continue with Google
    </Button>
  );
}
