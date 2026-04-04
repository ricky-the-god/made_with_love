"use client";

import type { MouseEvent } from "react";
import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

const GRAIN_SVG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")";

const BOOKS = [
  { id: "book-1", src: "/images/Book1.png", alt: "Family recipes", rotation: -10 },
  { id: "book-2", src: "/images/Book2.png", alt: "Recipe memories", rotation: -6 },
  { id: "book-3", src: "/images/Book3.png", alt: "Family stories", rotation: -2 },
  { id: "book-4", src: "/images/Book4.png", alt: "Family recipes", rotation: 2 },
  { id: "book-5", src: "/images/Book5.png", alt: "Recipe memories", rotation: 5 },
  { id: "book-6", src: "/images/Book6.png", alt: "Family stories", rotation: 8 },
  { id: "book-7", src: "/images/Book7.png", alt: "Recipe memories", rotation: 4 },
  { id: "book-8", src: "/images/Book8.png", alt: "Family stories", rotation: -3 },
] as const;

export function HeroSection() {
  const reducedMotion = usePreferencesStore((s) => s.reducedMotion);
  const isReducedMotion = reducedMotion === "reduce";

  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [bookAngles, setBookAngles] = useState<number[]>(BOOKS.map((_, i) => i * (360 / BOOKS.length)));

  useEffect(() => {
    if (isReducedMotion) return;
    const id = setInterval(() => {
      setBookAngles((prev) => prev.map((a) => (a + 0.25) % 360));
    }, 50);
    return () => clearInterval(id);
  }, [isReducedMotion]);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  };

  if (isReducedMotion) return <ReducedMotionHero />;

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#322c2b]">
      {/* Invisible cover captures mouse for 3D tilt — aria-hidden so it is decorative only */}
      <div aria-hidden className="absolute inset-0" onMouseMove={handleMouseMove} />
      {/* ── Grain ──────────────────────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: GRAIN_SVG, backgroundRepeat: "repeat", backgroundSize: "128px" }}
      />

      {/* ── Bottom text-lift gradient ──────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.20) 40%, transparent 70%)",
        }}
      />

      {/* ── Floating books ─────────────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none relative flex h-[52vh] w-full items-center justify-center"
        style={{ perspective: "1000px" }}
      >
        {BOOKS.map((book, i) => {
          const rad = (bookAngles[i] ?? 0) * (Math.PI / 180);
          const x = Math.cos(rad) * 200;
          const y = Math.sin(rad) * 85;
          const tiltX = (mousePos.y - 0.5) * 18;
          const tiltY = (mousePos.x - 0.5) * 18;

          return (
            <div
              key={book.id}
              className="absolute h-36 w-28 transition-transform duration-75 sm:h-48 sm:w-36"
              style={{
                transform: `translate(${x}px, ${y}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${book.rotation}deg)`,
                transformStyle: "preserve-3d",
                zIndex: Math.round(Math.sin(rad) * 10) + 10,
              }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
                <Image
                  src={book.src}
                  alt={book.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 640px) 112px, 144px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/30" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Text content ───────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-3xl px-6 pb-20 text-center sm:px-8">
        <p
          className="mb-5 font-medium text-[#e4c59e] text-[10px] uppercase tracking-[0.22em]"
          style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
        >
          A living family archive
        </p>

        <h1
          className="mb-6 font-normal text-5xl text-white leading-[1.08] sm:text-6xl lg:text-7xl"
          style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
        >
          Every family
          <br />
          has a tree.
        </h1>

        <p
          className="mx-auto mb-10 max-w-xl text-[#e4c59e]/85 text-base leading-relaxed sm:text-lg"
          style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
        >
          The people who fed you, the recipes they carried, the stories that live in the food. All of it, kept safe.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-amber-700 px-8 text-base text-white shadow-lg hover:bg-amber-600"
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
            className="rounded-full px-8 text-base text-white/70 hover:bg-white/10 hover:text-white"
          >
            <Link href="#how-it-works">See how it works</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// ── Reduced-motion fallback ───────────────────────────────────────────────────

function ReducedMotionHero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-[#322c2b] px-6 pb-20 text-center sm:px-8">
      <p
        className="mb-5 font-medium text-[#e4c59e] text-[10px] uppercase tracking-[0.22em]"
        style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
      >
        A living family archive
      </p>
      <h1
        className="mb-6 font-normal text-5xl text-white leading-[1.08] sm:text-6xl lg:text-7xl"
        style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
      >
        Every family
        <br />
        has a tree.
      </h1>
      <p
        className="mx-auto mb-10 max-w-xl text-[#e4c59e]/85 text-base leading-relaxed sm:text-lg"
        style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
      >
        The people who fed you, the recipes they carried, the stories that live in the food. All of it, kept safe.
      </p>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          asChild
          size="lg"
          className="rounded-full bg-amber-700 px-8 text-base text-white shadow-lg hover:bg-amber-600"
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
          className="rounded-full px-8 text-base text-white/70 hover:bg-white/10 hover:text-white"
        >
          <Link href="#how-it-works">See how it works</Link>
        </Button>
      </div>
    </section>
  );
}
