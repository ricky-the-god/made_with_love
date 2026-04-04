"use client";

import React from "react";

import Link from "next/link";

import { Menu, X } from "lucide-react";

import { HoverButton } from "@/components/ui/hover-button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Discover", href: "#discover" },
  { label: "Families", href: "#families" },
] as const;

export function LandingNav() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header>
      <nav data-state={menuOpen ? "active" : undefined} className="fixed top-0 left-0 z-50 w-full px-2">
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            scrolled && "max-w-4xl rounded-2xl border border-[#af8260]/45 bg-[#322c2b]/85 backdrop-blur-lg lg:px-5",
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0">
            {/* ── Logo + mobile toggle ─────────────────────────────────── */}
            <div className="flex w-full justify-between lg:w-auto">
              <Link href="/" aria-label="Made with Love home" className="flex items-center gap-2">
                <span
                  className="font-semibold text-[#e4c59e] text-xl tracking-tight"
                  style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
                >
                  Made with Love
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="-m-2.5 -mr-4 relative z-20 block cursor-pointer p-2.5 text-white/70 lg:hidden"
              >
                <Menu
                  className={cn("size-6 transition-all duration-200", menuOpen && "rotate-180 scale-0 opacity-0")}
                />
                <X
                  className={cn(
                    "absolute inset-0 m-auto size-6 transition-all duration-200",
                    menuOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-180 scale-0 opacity-0",
                  )}
                />
              </button>
            </div>

            {/* ── Desktop centred links ────────────────────────────────── */}
            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 transition-colors duration-150 hover:text-[#e4c59e]"
                      style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Mobile drawer + CTA buttons ─────────────────────────── */}
            <div
              className={cn(
                // mobile: hidden by default, revealed when nav is active
                "in-data-[state=active]:block",
                "mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-[#af8260]/40 bg-[#322c2b] p-6 shadow-2xl",
                // desktop: always shown as flex, styles reset
                "lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:rounded-none lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none",
              )}
            >
              {/* Mobile-only nav links */}
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="text-white/70 transition-colors duration-150 hover:text-[#e4c59e]"
                        style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Auth buttons */}
              <div className="flex w-full flex-col gap-2 sm:flex-row md:w-fit">
                {/* Sign in — shown before scroll, hidden after */}
                <HoverButton asChild variant="ghost" size="sm" className={cn(scrolled && "lg:hidden")}>
                  <Link href="/auth/v2/login">Sign in</Link>
                </HoverButton>

                {/* Start for free — shown before scroll */}
                <HoverButton asChild variant="dark" size="sm" className={cn(scrolled && "lg:hidden")}>
                  <Link href="/auth/v2/register">Start for free</Link>
                </HoverButton>

                {/* Condensed CTA — shown after scroll on desktop */}
                <HoverButton asChild variant="dark" size="sm" className={cn(scrolled ? "lg:inline-flex" : "hidden")}>
                  <Link href="/auth/v2/register">Start preserving</Link>
                </HoverButton>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
