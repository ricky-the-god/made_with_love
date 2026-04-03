"use client";

import { useState } from "react";

import { Check, Copy, Link } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrigin } from "@/hooks/use-origin";

interface CopyInviteLinkButtonProps {
  token: string;
}

export function CopyInviteLinkButton({ token }: CopyInviteLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const origin = useOrigin();

  const link = `${origin}/invite/${token}`;

  function handleCopy() {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Link className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2.5 size-3.5 text-muted-foreground" />
        <Input
          readOnly
          value={link}
          className="h-8 cursor-text pl-7 font-mono text-xs"
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
      </div>
      <Button type="button" variant="outline" size="sm" className="h-8 shrink-0 gap-1.5" onClick={handleCopy}>
        {copied ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5" />}
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}
