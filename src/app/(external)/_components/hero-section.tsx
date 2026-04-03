"use client";

import { useRef } from "react";

import Image from "next/image";
import Link from "next/link";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

const GRAIN_SVG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Use the app's own preference system (data-attribute based), not the OS media query
  const reducedMotion = usePreferencesStore((s) => s.reducedMotion);
  const resolvedThemeMode = usePreferencesStore((s) => s.resolvedThemeMode);

  const isReducedMotion = reducedMotion === "reduce";
  // multiply: white image bg disappears on white page (white × white = white)
  // luminosity: prevents darkening on dark backgrounds
  const blendMode = resolvedThemeMode === "dark" ? "luminosity" : "multiply";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Image zooms from 1× → 1.6× as user scrolls through the hero
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);
  // Text fades and drifts up in the first 45% of scroll
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.45], [0, -50]);

  // Static layout for reduced-motion users — no scroll effects
  if (isReducedMotion) {
    return (
      <section className="relative overflow-hidden bg-white px-6 pt-24 pb-20 dark:bg-stone-950">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{ backgroundImage: GRAIN_SVG, backgroundRepeat: "repeat", backgroundSize: "128px" }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <HeroTextContent />
        </div>
      </section>
    );
  }

  return (
    // 180vh outer section provides ~80vh of scroll distance for the animation
    <section ref={sectionRef} className="relative" style={{ height: "180vh" }}>
      {/* Sticky panel — stays pinned at viewport top while outer section scrolls */}
      <div className="sticky top-0 z-0 h-screen overflow-hidden bg-white dark:bg-stone-950">
        {/* ── Image layer — zooms with scroll ─────────────────────────────── */}
        <motion.div aria-hidden className="absolute inset-0" style={{ scale, transformOrigin: "center center" }}>
          <Image
            src="/images/hero-branch.jpeg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            style={{ mixBlendMode: blendMode }}
          />
        </motion.div>

        {/* ── Light mode gradient — fades image into white ─────────────────── */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 dark:hidden"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, transparent 30%, transparent 55%, rgba(255,255,255,0.97) 100%)",
          }}
        />

        {/* ── Dark mode gradient — fades image into black ──────────────────── */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden dark:block"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 55%, rgba(0,0,0,0.97) 100%)",
          }}
        />

        {/* ── Grain texture — subtle paper feel ───────────────────────────── */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{ backgroundImage: GRAIN_SVG, backgroundRepeat: "repeat", backgroundSize: "128px" }}
        />

        {/* ── Text layer — fades and drifts up on scroll ──────────────────── */}
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: textOpacity, y: textY }}
        >
          <HeroTextContent />
        </motion.div>
      </div>
    </section>
  );
}

// Shared between animated and reduced-motion paths — strictly black and white
function HeroTextContent() {
  return (
    <>
      <p
        className="mb-6 font-medium text-stone-400 text-xs uppercase tracking-widest dark:text-stone-500"
        style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
      >
        A living family archive
      </p>

      <h1
        className="mb-6 max-w-3xl font-normal text-5xl text-stone-900 leading-[1.1] sm:text-6xl lg:text-7xl dark:text-white"
        style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
      >
        Every family has recipes <em className="text-stone-500 not-italic dark:text-stone-400">worth remembering.</em>
      </h1>

      <p
        className="mx-auto mb-10 max-w-xl text-lg text-stone-500 leading-relaxed dark:text-stone-400"
        style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
      >
        Made with Love is for immigrant families, diaspora communities, and anyone who has lost someone and wants to
        hold onto the food they made. Preserve the person, the story, and the memory behind every dish.
      </p>

      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button
          asChild
          size="lg"
          className="rounded-full bg-stone-900 px-8 text-base text-white shadow-sm hover:bg-stone-700 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100"
        >
          <Link href="/auth/v2/register">
            Start preserving
            <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="lg"
          className="rounded-full px-8 text-base text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800/50"
        >
          <Link href="#how-it-works">See how it works</Link>
        </Button>
      </div>

      <p
        className="mt-8 text-sm text-stone-400 italic dark:text-stone-500"
        style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
      >
        A tender, unhurried place for your family&apos;s culinary heritage
      </p>
    </>
  );
}
