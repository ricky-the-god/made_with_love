import { BookOpen, Heart, Quote } from "lucide-react";
import Balancer from "react-wrap-balancer";

import type { Memory } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

// ── Layout primitives (scoped to this file) ───────────────────────────────────

const Section = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <section className={cn("border-amber-100 border-b py-10 md:py-16 dark:border-amber-900/20", className)}>
    {children}
  </section>
);

const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("mx-auto max-w-5xl px-6 sm:px-8", className)}>{children}</div>
);

// ── Props ─────────────────────────────────────────────────────────────────────

interface RecipeStorySectionProps {
  description?: string | null;
  memories: Memory[];
  memberName?: string | null;
  countryOfOrigin?: string | null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function RecipeStorySection({ description, memories, memberName, countryOfOrigin }: RecipeStorySectionProps) {
  const hasDescription = !!description?.trim();
  const hasMemories = memories.length > 0;

  if (!hasDescription && !hasMemories) return null;

  const storyItems: {
    id: string;
    icon: React.ReactNode;
    title: string;
    body: string;
    note?: string;
  }[] = [];

  if (hasDescription && description) {
    storyItems.push({
      id: "description",
      icon: <BookOpen className="size-6 text-amber-700 dark:text-amber-400" aria-hidden="true" />,
      title: "About this dish",
      body: description,
    });
  }

  storyItems.push(
    ...memories
      .filter((m) => m.text || m.meaning_note)
      .slice(0, 2)
      .map((m, index) => ({
        id: m.id || `memory-${index}`,
        icon: <Heart className="size-6 text-amber-700 dark:text-amber-400" aria-hidden="true" />,
        title: m.occasion ?? "A memory",
        body: m.text ?? m.meaning_note ?? "",
        note: m.text && m.meaning_note ? m.meaning_note : undefined,
      })),
  );

  const eyebrow = [memberName, countryOfOrigin].filter(Boolean).join(" · ");

  return (
    <Section>
      <Container>
        <div className="not-prose flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-3">
            {eyebrow && (
              <p className="font-medium text-[11px] text-amber-700 uppercase tracking-[0.2em] dark:text-amber-500">
                {eyebrow}
              </p>
            )}
            <h3
              className="font-normal text-3xl text-[#322c2b] leading-snug sm:text-4xl dark:text-[#e4c59e]"
              style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
            >
              <Balancer>The story behind this recipe</Balancer>
            </h3>
            <p
              className="max-w-xl font-light text-[#6e5750] text-lg opacity-80 dark:text-[#ceb8a0]"
              style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
            >
              <Balancer>Every dish carries the person who first made it.</Balancer>
            </p>
          </div>

          {/* Story cards */}
          <div
            className={cn(
              "mt-4 grid gap-6 md:mt-10",
              storyItems.length === 1 ? "max-w-2xl md:grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3",
            )}
          >
            {storyItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-amber-100 bg-amber-50/40 p-6 dark:border-amber-900/20 dark:bg-amber-950/10"
              >
                {/* Icon */}
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                  {item.icon}
                </div>

                {/* Title */}
                <h4
                  className="font-medium text-[#322c2b] text-lg capitalize dark:text-[#e4c59e]"
                  style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
                >
                  {item.title}
                </h4>

                {/* Body */}
                <p
                  className="text-[#6e5750] text-base leading-relaxed opacity-90 dark:text-[#ceb8a0]"
                  style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
                >
                  {item.body}
                </p>

                {/* Meaning note */}
                {item.note && (
                  <blockquote className="mt-1 flex items-start gap-2 border-amber-300 border-l-2 pl-3 dark:border-amber-700">
                    <Quote className="mt-0.5 size-3.5 shrink-0 text-amber-400" aria-hidden="true" />
                    <p className="font-serif text-[#6e5750] text-sm italic dark:text-[#ceb8a0]">{item.note}</p>
                  </blockquote>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
