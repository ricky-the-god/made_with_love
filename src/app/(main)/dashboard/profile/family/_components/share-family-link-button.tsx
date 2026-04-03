"use client";

import { useState } from "react";

import { Check, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ShareFamilyLinkButtonProps {
  familyId: string;
}

export function ShareFamilyLinkButton({ familyId }: ShareFamilyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const link = `${window.location.origin}/dashboard/discover/family/${familyId}`;

  function handleCopy() {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Button variant="outline" size="sm" className="gap-1.5" onClick={handleCopy}>
      {copied ? <Check className="size-3.5 text-green-600" /> : <Share2 className="size-3.5" />}
      {copied ? "Link copied!" : "Copy share link"}
    </Button>
  );
}
