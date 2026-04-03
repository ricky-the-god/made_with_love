"use client";

/**
 * ButtonSoftGlow
 *
 * A clean, premium white/black button with a soft ambient glow.
 *
 * Light mode — white background, near-black text, warm shadow
 * Dark mode  — deep stone background, white text, soft white glow
 *
 * Design intent: monochrome elegant — sophisticated, timeless, and calm.
 * Intentionally avoids amber/brand colour so it reads as a neutral
 * utility action rather than a primary brand call-to-action.
 */

import * as React from "react";

import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

export interface ButtonSoftGlowProps extends React.ComponentProps<"button"> {
  /** Render the button as a child element (e.g. an <a> tag) */
  asChild?: boolean;
}

export function ButtonSoftGlow({
  className,
  asChild = false,
  children,
  ...props
}: ButtonSoftGlowProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button-soft-glow"
      className={cn(
        // Base layout
        "inline-flex items-center justify-center gap-2 whitespace-nowrap",
        "rounded-md px-4 py-2 text-sm font-medium",
        // Transitions
        "transition-all duration-200 ease-out",
        // Disabled
        "disabled:pointer-events-none disabled:opacity-40",
        // SVG children
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // Focus ring
        "outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 dark:focus-visible:ring-stone-500",

        // ── Light mode ──────────────────────────────────────────────────────
        // White background, warm-charcoal text, crisp 1px border, warm shadow
        "bg-white text-stone-900 border border-stone-200",
        "shadow-[0_2px_10px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.06)]",
        "hover:bg-stone-50 hover:border-stone-300",
        "hover:shadow-[0_4px_18px_rgba(0,0,0,0.13),0_1px_4px_rgba(0,0,0,0.08)]",

        // ── Dark mode ───────────────────────────────────────────────────────
        // Deep stone background, white text, soft outward white glow
        "dark:bg-stone-900 dark:text-white dark:border-stone-700",
        "dark:shadow-[0_2px_10px_rgba(255,255,255,0.05),0_1px_3px_rgba(0,0,0,0.4)]",
        "dark:hover:bg-stone-800 dark:hover:border-stone-600",
        "dark:hover:shadow-[0_4px_20px_rgba(255,255,255,0.09),0_1px_4px_rgba(0,0,0,0.5)]",

        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

// ── Demo export ────────────────────────────────────────────────────────────────
// Matches the reference: import { ButtonDemo } from "@/components/ui/button-soft-glow"
import { Plus } from "lucide-react";

export function ButtonDemo() {
  return (
    <ButtonSoftGlow>
      <Plus className="size-4" />
      Add Member
    </ButtonSoftGlow>
  );
}
