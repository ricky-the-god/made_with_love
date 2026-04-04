"use client";

import { MotionConfig, motion } from "framer-motion";
import { Check, Flame, Leaf, Sparkles, TreePine, UtensilsCrossed } from "lucide-react";

// ─── Shared animation helpers ────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: EASE, delay },
});

const fadeIn = (delay = 0, x = 0) => ({
  initial: { opacity: 0, x },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: EASE, delay },
});

// ─── Feature 2 Visual — Recipe + Calories ────────────────────────────────────

function RecipeCardVisual() {
  const ingredients = ["500g beef bones", "Star anise & cinnamon", "Rice noodles (bánh phở)", "Fresh herbs & lime"];
  const nutrients = [
    { label: "Calories", value: "312", color: "bg-amber-400" },
    { label: "Protein", value: "6g", color: "bg-orange-300" },
    { label: "Carbs", value: "48g", color: "bg-yellow-300" },
    { label: "Fat", value: "11g", color: "bg-red-300" },
  ];

  return (
    <motion.div
      {...fadeIn(0, 40)}
      className="mx-auto w-full max-w-sm rounded-2xl border border-amber-100 bg-white p-5 shadow-amber-100/60 shadow-xl"
    >
      {/* AI badge */}
      <motion.div {...fadeUp(0.1)} className="mb-3 flex items-center gap-1.5">
        <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 font-semibold text-[10px] text-amber-700">
          <Sparkles className="size-3" />
          AI extracted
        </span>
        <span className="text-[#af8260]/70 text-[10px]">from handwritten card</span>
      </motion.div>

      <motion.h4
        {...fadeUp(0.15)}
        className="mb-1 font-semibold text-[#322c2b] text-base"
        style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
      >
        Bà Nội&apos;s Phở Bò
      </motion.h4>
      <motion.p {...fadeUp(0.2)} className="mb-4 text-[#af8260]/70 text-[11px]">
        Passed down from Hanoi, Vietnam • Serves 4
      </motion.p>

      {/* Ingredients */}
      <motion.ul {...fadeUp(0.25)} className="mb-4 space-y-1.5">
        {ingredients.map((ing, i) => (
          <motion.li
            key={ing}
            {...fadeUp(0.25 + i * 0.05)}
            className="flex items-center gap-2 text-[#6e5750] text-[11px]"
          >
            <span className="size-1.5 shrink-0 rounded-full bg-amber-400" />
            {ing}
          </motion.li>
        ))}
      </motion.ul>

      {/* Nutrition grid */}
      <motion.div {...fadeUp(0.45)} className="rounded-xl bg-amber-50 p-3">
        <p className="mb-2 flex items-center gap-1 font-semibold text-[9px] text-amber-700 uppercase tracking-wider">
          <Flame className="size-3" aria-hidden="true" /> Nutrition per serving
        </p>
        <div className="grid grid-cols-4 gap-2">
          {nutrients.map((n, i) => (
            <motion.div key={n.label} {...fadeUp(0.5 + i * 0.05)} className="flex flex-col items-center gap-1">
              <div className={`${n.color} h-1 w-full rounded-full`} />
              <span className="font-bold text-[#322c2b] text-sm">{n.value}</span>
              <span className="text-[#af8260]/70 text-[9px]">{n.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Feature 3 Visual — Cooking Instructions ─────────────────────────────────

function CookingStepsVisual() {
  const steps = [
    { num: "01", text: "Char ginger and onion directly over an open flame.", done: true },
    { num: "02", text: "Blanch beef bones, rinse, then add to fresh water.", done: true },
    { num: "03", text: "Simmer broth with spices for at least 3 hours.", done: false, active: true },
    { num: "04", text: "Soak rice noodles in cold water for 20 minutes.", done: false },
    { num: "05", text: "Assemble bowls — ladle hot broth over noodles.", done: false },
  ];

  return (
    <motion.div {...fadeIn(0, -40)} className="mx-auto w-full max-w-sm space-y-2.5">
      {/* Progress bar */}
      <motion.div {...fadeUp(0)} className="mb-5 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e4c59e]/40">
          <motion.div
            className="h-full rounded-full bg-amber-500"
            initial={{ width: 0 }}
            whileInView={{ width: "40%" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
          />
        </div>
        <span className="shrink-0 font-medium text-[#af8260]/70 text-xs">Step 3 of 5</span>
      </motion.div>

      {steps.map((step, i) => (
        <motion.div
          key={step.num}
          {...fadeUp(0.1 + i * 0.08)}
          className={`flex items-start gap-3 rounded-xl p-3 transition-colors ${
            step.active ? "border border-amber-200 bg-amber-50 shadow-sm" : step.done ? "opacity-50" : "bg-[#fcf8f2]"
          }`}
        >
          <div
            className={`flex size-7 shrink-0 items-center justify-center rounded-full font-bold text-[10px] ${
              step.done
                ? "bg-amber-500 text-white"
                : step.active
                  ? "border-2 border-amber-500 bg-white text-amber-600"
                  : "bg-[#e4c59e]/50 text-[#af8260]"
            }`}
          >
            {step.done ? <Check className="size-3.5" aria-hidden="true" /> : step.num}
          </div>
          <p
            className={`pt-0.5 text-xs leading-relaxed ${step.active ? "font-medium text-[#322c2b]" : "text-[#6e5750]"}`}
          >
            {step.text}
          </p>
          {step.active && <UtensilsCrossed className="mt-0.5 size-4 shrink-0 text-amber-400" aria-hidden="true" />}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Feature row layout ───────────────────────────────────────────────────────

function FeatureRow({
  tag,
  tagIcon: TagIcon,
  headline,
  body,
  visual,
  reverse = false,
  bg = "bg-white",
}: {
  tag: string;
  tagIcon: React.ElementType;
  headline: string;
  body: string;
  visual?: React.ReactNode;
  reverse?: boolean;
  bg?: string;
}) {
  return (
    <section className={`${bg} overflow-hidden px-6 py-24`}>
      <div
        className={`mx-auto flex max-w-6xl flex-col items-center gap-16 ${visual ? "lg:flex-row" : ""} ${
          visual && reverse ? "lg:flex-row-reverse" : ""
        }`}
      >
        {/* Text side */}
        <div className={`text-center ${visual ? "flex-1 lg:text-left" : "max-w-3xl"}`}>
          <motion.div
            {...fadeUp(0)}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1"
          >
            <TagIcon className="size-3.5 text-amber-700" />
            <span className="font-semibold text-[10px] text-amber-700 uppercase tracking-widest">{tag}</span>
          </motion.div>

          <motion.h2
            {...fadeUp(0.08)}
            className="mb-5 font-normal text-3xl text-[#322c2b] leading-snug sm:text-4xl lg:text-5xl dark:text-[#e4c59e]"
            style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
          >
            {headline}
          </motion.h2>

          <motion.p
            {...fadeUp(0.16)}
            className="max-w-lg text-[#6e5750] text-base leading-relaxed lg:mx-0 dark:text-[#ceb8a0]"
            style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
          >
            {body}
          </motion.p>
        </div>

        {visual ? (
          <motion.div {...fadeIn(0.1, reverse ? -50 : 50)} className="w-full flex-1">
            {visual}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function FeaturesShowcase() {
  return (
    <MotionConfig reducedMotion="user">
      <FeatureRow
        tag="Family Tree"
        tagIcon={TreePine}
        headline={`Your roots,\nbeautifully mapped.`}
        body="Build a living tree of everyone who shaped your table. Each person holds their own recipes, their own memories, their own story. A way for young people to stay connected to where they come from — one dish at a time."
        bg="bg-amber-50/40"
      />

      <FeatureRow
        tag="AI-Powered Recipes"
        tagIcon={Sparkles}
        headline={`Recipes that know\nwhat they're made of.`}
        body="Photograph a handwritten recipe card and our AI extracts, structures, and estimates the nutritional value for you. Calories, protein, carbs — every dish your family makes, understood at a glance."
        visual={<RecipeCardVisual />}
        reverse
        bg="bg-white"
      />

      <FeatureRow
        tag="Guided Cooking"
        tagIcon={Leaf}
        headline={`Cook like you were\ntaught by someone you love.`}
        body="Step-by-step cooking instructions that hold your hand through every recipe. Follow along at your own pace, learn the story behind each step, and feel the presence of the person who first made it."
        visual={<CookingStepsVisual />}
        bg="bg-[#fcf8f2]"
      />
    </MotionConfig>
  );
}
