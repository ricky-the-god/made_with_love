"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFamily } from "@/server/family-actions";

export function CreateFamilyForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    const result = await createFamily(name.trim());

    if (result && "error" in result && result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="family-name-create">Family name</Label>
        <div className="flex gap-2">
          <Input
            id="family-name-create"
            placeholder="e.g. The Nguyen Family"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading || !name.trim()}
            className="shrink-0 bg-amber-700 text-white hover:bg-amber-800"
          >
            {loading ? "Creating…" : "Create family"}
          </Button>
        </div>
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </form>
  );
}
