"use client";

import { useState, useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquare, Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addMemory } from "@/server/recipe-actions";

const schema = z.object({
  text: z.string().min(1, "Please write a memory or story."),
  occasion: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface AddMemoryFormProps {
  recipeId: string;
}

export function AddMemoryForm({ recipeId }: AddMemoryFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await addMemory(recipeId, {
        text: values.text,
        occasion: values.occasion || undefined,
      });

      if ("error" in result) {
        alert(result.error);
        return;
      }

      reset();
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="mt-3 h-8 text-amber-700 hover:text-amber-800"
      >
        <Plus className="size-3.5" />
        Add a memory
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="memory-text" className="text-sm">
          Memory or story
        </Label>
        <Textarea
          id="memory-text"
          placeholder="Who made this dish? When did it matter most? What does it mean to your family?"
          className="min-h-[80px] resize-none text-sm"
          {...register("text")}
        />
        {errors.text && <p className="text-destructive text-xs">{errors.text.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="occasion" className="text-sm">
          Occasion (optional)
        </Label>
        <Input
          id="occasion"
          placeholder="e.g. Lunar New Year, Sunday dinners, Grandpa's birthday"
          className="text-sm"
          {...register("occasion")}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending} size="sm" className="bg-amber-700 text-white hover:bg-amber-800">
          {isPending ? "Saving..." : "Save memory"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            reset();
            setOpen(false);
          }}
        >
          <X className="size-3.5" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
