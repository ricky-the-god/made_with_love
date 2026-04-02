import Link from "next/link";

import { ArrowRight, BookOpen, ChefHat, Heart, TreePine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-stone-950">
      {/* ─── Nav ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-amber-100/80 border-b bg-white/90 backdrop-blur-sm dark:border-stone-800/60 dark:bg-stone-950/90">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Wordmark */}
          <span
            className="font-semibold text-amber-900 text-xl tracking-tight dark:text-amber-200"
            style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
          >
            Made with Love
          </span>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-amber-900 hover:bg-amber-50 hover:text-amber-900 dark:text-amber-300 dark:hover:bg-amber-950/40"
            >
              <Link href="/auth/v2/login">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
            >
              <Link href="/auth/v2/register">Start for free</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main>
        {/* ─── Hero ────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 to-white px-6 pt-24 pb-20 dark:from-stone-900/60 dark:to-stone-950">
          {/* Soft decorative grain overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
              backgroundRepeat: "repeat",
              backgroundSize: "128px",
            }}
          />

          <div className="relative mx-auto max-w-3xl text-center">
            {/* Eyebrow */}
            <p
              className="mb-6 font-medium text-amber-700 text-sm uppercase tracking-widest dark:text-amber-400"
              style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
            >
              A living family archive
            </p>

            {/* Headline */}
            <h1
              className="mb-6 font-normal text-5xl text-stone-800 leading-[1.12] sm:text-6xl dark:text-amber-50"
              style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
            >
              Every family has recipes{" "}
              <em className="text-amber-800 not-italic dark:text-amber-300">worth remembering.</em>
            </h1>

            {/* Subheadline */}
            <p
              className="mx-auto mb-10 max-w-2xl text-lg text-stone-500 leading-relaxed dark:text-stone-400"
              style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
            >
              Made with Love is for immigrant families, diaspora communities, and anyone who has lost someone and wants
              to hold onto the food they made. Preserve not just the recipe — preserve the person, the story, and the
              memory behind every dish.
            </p>

            {/* CTAs */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-amber-700 px-8 text-base text-white shadow-md hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
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
                className="rounded-full px-8 text-amber-900 text-base hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/30"
              >
                <Link href="#how-it-works">See how it works</Link>
              </Button>
            </div>

            {/* Social proof line */}
            <p className="mt-8 text-sm text-stone-400 dark:text-stone-500">
              A tender, unhurried place for your family's culinary heritage
            </p>
          </div>
        </section>

        {/* ─── Feature highlights ──────────────────────────────────────────── */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 sm:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col gap-5 rounded-2xl border border-amber-100 bg-amber-50/40 p-8 dark:border-amber-900/20 dark:bg-amber-950/10">
                <div className="flex size-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  <TreePine className="size-5" />
                </div>
                <div>
                  <h3
                    className="mb-2 font-medium text-lg text-stone-800 dark:text-amber-100"
                    style={{
                      fontFamily: "var(--font-gabriela, Georgia, serif)",
                    }}
                  >
                    The Family Tree
                  </h3>
                  <p
                    className="text-sm text-stone-500 leading-relaxed dark:text-stone-400"
                    style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
                  >
                    Every recipe belongs to a person. Build a living tree of the people who fed you — their faces, their
                    stories, their dishes, passed down and kept safe.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col gap-5 rounded-2xl border border-amber-100 bg-amber-50/40 p-8 dark:border-amber-900/20 dark:bg-amber-950/10">
                <div className="flex size-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  <BookOpen className="size-5" />
                </div>
                <div>
                  <h3
                    className="mb-2 font-medium text-lg text-stone-800 dark:text-amber-100"
                    style={{
                      fontFamily: "var(--font-gabriela, Georgia, serif)",
                    }}
                  >
                    Recipe Memories
                  </h3>
                  <p
                    className="text-sm text-stone-500 leading-relaxed dark:text-stone-400"
                    style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
                  >
                    Go beyond ingredients. Attach stories, occasions, and the meaning behind every dish so the feeling —
                    not just the formula — is never lost.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col gap-5 rounded-2xl border border-amber-100 bg-amber-50/40 p-8 dark:border-amber-900/20 dark:bg-amber-950/10">
                <div className="flex size-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  <ChefHat className="size-5" />
                </div>
                <div>
                  <h3
                    className="mb-2 font-medium text-lg text-stone-800 dark:text-amber-100"
                    style={{
                      fontFamily: "var(--font-gabriela, Georgia, serif)",
                    }}
                  >
                    Guided Cooking
                  </h3>
                  <p
                    className="text-sm text-stone-500 leading-relaxed dark:text-stone-400"
                    style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
                  >
                    Cook together even when apart. Step-by-step guidance that feels like being taught by someone you
                    love — one quiet step at a time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6">
          <Separator className="bg-amber-100 dark:bg-stone-800" />
        </div>

        {/* ─── Who this is for ─────────────────────────────────────────────── */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <Heart className="mx-auto mb-6 size-6 text-amber-400 dark:text-amber-500" />
            <h2
              className="mb-6 font-normal text-3xl text-stone-800 leading-snug sm:text-4xl dark:text-amber-50"
              style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
            >
              For the families who carry their culture in their kitchens
            </h2>
            <p
              className="text-base text-stone-500 leading-[1.85] dark:text-stone-400"
              style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
            >
              For the grandmother whose handwritten recipe card is held together with tape. For the family that crossed
              an ocean and carried their flavors with them. For the child who never learned how their mother made that
              dish and now wishes they had asked. Made with Love exists for all of you — for the diaspora family keeping
              traditions alive across borders, for the community that grieves through food, and for anyone who
              understands that a recipe is really a person, still speaking.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6">
          <Separator className="bg-amber-100 dark:bg-stone-800" />
        </div>

        {/* ─── How it works ────────────────────────────────────────────────── */}
        <section id="how-it-works" className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <h2
                className="font-normal text-3xl text-stone-800 sm:text-4xl dark:text-amber-50"
                style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
              >
                Simple from the first day
              </h2>
              <p
                className="mt-3 text-base text-stone-400 dark:text-stone-500"
                style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
              >
                Three gentle steps to begin your family archive
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {/* Step 1 */}
              <div className="relative flex flex-col gap-4">
                <div
                  aria-hidden
                  className="mb-1 select-none font-normal text-6xl text-amber-200 leading-none dark:text-amber-900/60"
                  style={{
                    fontFamily: "var(--font-gabriela, Georgia, serif)",
                  }}
                >
                  01
                </div>
                <h3
                  className="font-medium text-lg text-stone-800 dark:text-amber-100"
                  style={{
                    fontFamily: "var(--font-gabriela, Georgia, serif)",
                  }}
                >
                  Build your family tree
                </h3>
                <p
                  className="text-sm text-stone-500 leading-relaxed dark:text-stone-400"
                  style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
                >
                  Add family members one by one — their names, their relation to you, a photo, a line about who they
                  were. Each person becomes a keeper of their own recipe book.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col gap-4">
                <div
                  aria-hidden
                  className="mb-1 select-none font-normal text-6xl text-amber-200 leading-none dark:text-amber-900/60"
                  style={{
                    fontFamily: "var(--font-gabriela, Georgia, serif)",
                  }}
                >
                  02
                </div>
                <h3
                  className="font-medium text-lg text-stone-800 dark:text-amber-100"
                  style={{
                    fontFamily: "var(--font-gabriela, Georgia, serif)",
                  }}
                >
                  Preserve the recipes
                </h3>
                <p
                  className="text-sm text-stone-500 leading-relaxed dark:text-stone-400"
                  style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
                >
                  Write recipes by hand or photograph an old recipe card — our AI reads and transcribes it for you to
                  review. Attach a memory or story to every dish before you save it.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col gap-4">
                <div
                  aria-hidden
                  className="mb-1 select-none font-normal text-6xl text-amber-200 leading-none dark:text-amber-900/60"
                  style={{
                    fontFamily: "var(--font-gabriela, Georgia, serif)",
                  }}
                >
                  03
                </div>
                <h3
                  className="font-medium text-lg text-stone-800 dark:text-amber-100"
                  style={{
                    fontFamily: "var(--font-gabriela, Georgia, serif)",
                  }}
                >
                  Cook with memory
                </h3>
                <p
                  className="text-sm text-stone-500 leading-relaxed dark:text-stone-400"
                  style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
                >
                  Follow step-by-step guided cooking while learning the story behind each dish. Cook alongside the
                  people who made these recipes — even if they're no longer here.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Final CTA ───────────────────────────────────────────────────── */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-3xl border border-amber-100 bg-amber-50/60 px-8 py-16 text-center dark:border-amber-900/20 dark:bg-amber-950/10">
              <h2
                className="mb-4 font-normal text-3xl text-stone-800 sm:text-4xl dark:text-amber-50"
                style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
              >
                Start preserving your family's culinary heritage
              </h2>
              <p
                className="mb-10 text-base text-stone-500 dark:text-stone-400"
                style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
              >
                Free to start. A living archive that grows with your family.
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-full bg-amber-700 px-10 text-base text-white shadow-md hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
              >
                <Link href="/auth/v2/register">
                  Create your family archive
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-amber-100/60 border-t px-6 py-8 dark:border-stone-800/50">
        <p
          className="text-center text-sm text-stone-400 dark:text-stone-600"
          style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
        >
          &copy; 2025 Made with Love
        </p>
      </footer>
    </div>
  );
}
