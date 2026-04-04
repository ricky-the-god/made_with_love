"use client";

import Image from "next/image";
import Link from "next/link";

import { MotionConfig, motion } from "framer-motion";
import { ArrowRight, BookOpen, ChefHat, Heart, TreePine } from "lucide-react";

import { HoverButton } from "@/components/ui/hover-button";
import { Separator } from "@/components/ui/separator";

import { ContainerScroll } from "./container-scroll";
import { FeaturesShowcase } from "./features-showcase";

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: EASE_EXPO, delay },
});

const FEATURES = [
  {
    icon: TreePine,
    title: "The Family Tree",
    body: "Every recipe belongs to a person. Build a living tree of the people who fed you — their faces, their stories, their dishes, passed down and kept safe.",
  },
  {
    icon: BookOpen,
    title: "Recipe Memories",
    body: "Go beyond ingredients. Attach stories, occasions, and the meaning behind every dish so the feeling — not just the formula — is never lost.",
  },
  {
    icon: ChefHat,
    title: "Guided Cooking",
    body: "Cook together even when apart. Step-by-step guidance that feels like being taught by someone you love — one quiet step at a time.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Build your family tree",
    body: "Add family members one by one — their names, their relation to you, a photo, a line about who they were. Each person becomes a keeper of their own recipe book.",
  },
  {
    num: "02",
    title: "Preserve the recipes",
    body: "Write recipes by hand or photograph an old recipe card — our AI reads and transcribes it for you to review. Attach a memory or story to every dish before you save it.",
  },
  {
    num: "03",
    title: "Cook with memory",
    body: "Follow step-by-step guided cooking while learning the story behind each dish. Cook alongside the people who made these recipes — even if they're no longer here.",
  },
];

export function LandingSections() {
  return (
    <MotionConfig reducedMotion="user">
      {/* ─── Scroll reveal image ───────────────────────────────────────────── */}
      <ContainerScroll
        titleComponent={
          <div className="mb-6">
            <p
              className="mb-3 font-medium text-[10px] text-amber-700 uppercase tracking-[0.22em]"
              style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
            >
              A living family archive
            </p>
            <h2
              className="font-normal text-3xl text-[#322c2b] sm:text-4xl lg:text-5xl dark:text-[#e4c59e]"
              style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
            >
              Where every branch
              <br />
              holds a story.
            </h2>
          </div>
        }
      >
        <Image
          src="/images/OpenedBook2.png"
          alt="An opened recipe book filled with family memories"
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 80vw"
        />
      </ContainerScroll>

      {/* ─── Feature showcase (3 alternating sections) ────────────────────── */}
      <FeaturesShowcase />

      {/* ─── Feature highlights ────────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp(i * 0.08)}
                className="flex flex-col gap-5 rounded-2xl border border-amber-100 bg-amber-50/40 p-8 dark:border-amber-900/20 dark:bg-amber-950/10"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  <f.icon className="size-5" />
                </div>
                <div>
                  <h3
                    className="mb-2 font-medium text-[#322c2b] text-lg dark:text-[#e4c59e]"
                    style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="text-[#6e5750] text-sm leading-relaxed dark:text-[#ceb8a0]"
                    style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
                  >
                    {f.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <Separator className="bg-amber-100 dark:bg-[#4a3b39]" />
      </div>

      {/* ─── Who this is for ───────────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <motion.div {...fadeUp()} className="mx-auto max-w-2xl text-center">
          <Heart className="mx-auto mb-6 size-6 text-amber-400 dark:text-amber-500" aria-hidden="true" />
          <h2
            className="mb-6 font-normal text-3xl text-[#322c2b] leading-snug sm:text-4xl dark:text-[#e4c59e]"
            style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
          >
            For the families who carry their culture in their kitchens
          </h2>
          <p
            className="text-[#6e5750] text-base leading-[1.85] dark:text-[#ceb8a0]"
            style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
          >
            For the grandmother whose handwritten recipe card is held together with tape. For the family that crossed an
            ocean and carried their flavors with them. For the child who never learned how their mother made that dish
            and now wishes they had asked. Made with Love exists for all of you — for the diaspora family keeping
            traditions alive across borders, for the community that grieves through food, and for anyone who understands
            that a recipe is really a person, still speaking.
          </p>
        </motion.div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <Separator className="bg-amber-100 dark:bg-[#4a3b39]" />
      </div>

      {/* ─── How it works ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp()} className="mb-14 text-center">
            <h2
              className="font-normal text-3xl text-[#322c2b] sm:text-4xl dark:text-[#e4c59e]"
              style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
            >
              Simple from the first day
            </h2>
            <p
              className="mt-3 text-[#af8260]/80 text-base dark:text-[#af8260]/60"
              style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
            >
              Three gentle steps to begin your family archive
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <motion.div key={step.num} {...fadeUp(i * 0.1)} className="relative flex flex-col gap-4">
                <div
                  aria-hidden
                  className="mb-1 select-none font-normal text-6xl text-amber-200 leading-none dark:text-amber-900/60"
                  style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
                >
                  {step.num}
                </div>
                <h3
                  className="font-medium text-[#322c2b] text-lg dark:text-[#e4c59e]"
                  style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-[#6e5750] text-sm leading-relaxed dark:text-[#ceb8a0]"
                  style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
                >
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: EASE_EXPO }}
            className="rounded-3xl border border-amber-100 bg-amber-50/60 px-8 py-16 text-center dark:border-amber-900/20 dark:bg-amber-950/10"
          >
            <h2
              className="mb-4 font-normal text-3xl text-[#322c2b] sm:text-4xl dark:text-[#e4c59e]"
              style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
            >
              Start preserving your family&apos;s culinary heritage
            </h2>
            <p
              className="mb-10 text-[#6e5750] text-base dark:text-[#ceb8a0]"
              style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
            >
              Free to start. A living archive that grows with your family.
            </p>
            <HoverButton asChild variant="light" size="lg">
              <Link href="/auth/v2/register">
                Create your family archive
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </HoverButton>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
