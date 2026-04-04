"use client";

import { motion, type Variants } from "framer-motion";
import { Facebook, Instagram, Twitter } from "lucide-react";

// ── Animation variants ────────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const linkVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const socialVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 10 },
  },
};

const backgroundVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 2, ease: [0.16, 1, 0.3, 1] } },
};

// ── Footer data ───────────────────────────────────────────────────────────────

const footerData = {
  sections: [
    {
      title: "Explore",
      links: [
        { label: "Family Tree", href: "/dashboard/tree" },
        { label: "Recipes", href: "/dashboard/recipes" },
        { label: "Guided Cooking", href: "/dashboard/recipes" },
        { label: "Discover", href: "/dashboard/discover" },
      ],
    },
    {
      title: "Get Started",
      links: [
        { label: "Create Account", href: "/auth/v2/register" },
        { label: "Sign In", href: "/auth/v2/login" },
        { label: "How It Works", href: "/#how-it-works" },
        { label: "Onboarding", href: "/onboarding" },
      ],
    },
    {
      title: "Our Mission",
      links: [
        { label: "For Diaspora Families", href: "#" },
        { label: "For Grieving Families", href: "#" },
        { label: "Cultural Preservation", href: "#" },
        { label: "About Us", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Help Center", href: "#" },
        { label: "Contact Us", href: "#" },
      ],
    },
  ],
  social: [
    { href: "#", label: "Twitter", Icon: Twitter },
    { href: "#", label: "Instagram", Icon: Instagram },
    { href: "#", label: "Facebook", Icon: Facebook },
  ],
  title: "Made with Love",
  subtitle: "A living family archive",
  copyright: `©${new Date().getFullYear()} Made with Love. All rights reserved.`,
};

// ── Sub-components ────────────────────────────────────────────────────────────

function NavSection({
  title,
  links,
  index,
}: {
  title: string;
  links: { label: string; href: string }[];
  index: number;
}) {
  return (
    <motion.div variants={itemVariants} custom={index} className="flex flex-col gap-2">
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
        className="mb-2 border-amber-200/40 border-b pb-1 font-semibold text-amber-400 text-xs uppercase tracking-wider transition-colors duration-300 hover:text-amber-300 dark:border-amber-800/40"
      >
        {title}
      </motion.h3>
      {links.map((link, linkIndex) => (
        <motion.div key={linkIndex} variants={linkVariants} custom={linkIndex}>
          <motion.a
            href={link.href}
            whileHover={{ x: 8, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className="relative block font-sans text-stone-400 text-xs transition-colors duration-300 hover:text-amber-300 md:text-sm"
          >
            <span className="relative">
              {link.label}
              <motion.span
                className="absolute bottom-0 left-0 h-px bg-amber-500"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </span>
          </motion.a>
        </motion.div>
      ))}
    </motion.div>
  );
}

function SocialLink({
  href,
  label,
  Icon,
  index,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  index: number;
}) {
  return (
    <motion.a
      variants={socialVariants}
      custom={index}
      href={href}
      whileHover={{ scale: 1.2, rotate: 12, transition: { type: "spring", stiffness: 300, damping: 15 } }}
      whileTap={{ scale: 0.9 }}
      className="flex size-7 items-center justify-center rounded-full bg-stone-800 text-stone-400 transition-colors duration-300 hover:bg-amber-800 hover:text-amber-200 md:size-9"
      aria-label={label}
    >
      <Icon className="size-3.5 md:size-4" />
    </motion.a>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function StickyFooter() {
  return (
    // Clip prevents the sticky footer from overflowing during upward scroll
    <div className="relative h-[70vh]" style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}>
      <div className="-top-[100vh] relative h-[calc(100vh+70vh)]">
        <div className="sticky top-[calc(100vh-70vh)] h-[70vh]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-stone-950 px-4 py-6 md:px-12 md:py-10"
          >
            {/* ── Ambient glow blobs ──────────────────────────────────────── */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

            <motion.div
              variants={backgroundVariants}
              className="absolute top-0 right-0 size-48 rounded-full bg-amber-800/10 blur-3xl md:size-96"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            <motion.div
              variants={backgroundVariants}
              className="absolute bottom-0 left-0 size-48 rounded-full bg-amber-900/10 blur-3xl md:size-96"
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
            />

            {/* ── Nav columns ────────────────────────────────────────────── */}
            <motion.div variants={containerVariants} className="relative z-10">
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-12 lg:gap-20">
                {footerData.sections.map((section, index) => (
                  <NavSection key={section.title} title={section.title} links={section.links} index={index} />
                ))}
              </div>
            </motion.div>

            {/* ── Bottom bar ─────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
              className="relative z-10 mt-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end md:gap-6"
            >
              {/* Wordmark */}
              <div className="flex-1">
                <motion.p
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                  whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                  className="cursor-default bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200/60 bg-clip-text font-serif text-[10vw] text-transparent leading-[0.85] md:text-[7vw] lg:text-[5.5vw]"
                  style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
                >
                  {footerData.title}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="mt-2 flex items-center gap-3 md:mt-3 md:gap-4"
                >
                  <motion.div
                    className="h-px w-8 bg-gradient-to-r from-amber-600 to-amber-400 md:w-12"
                    animate={{ scaleX: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  />
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.5 }}
                    className="font-sans text-stone-500 text-xs transition-colors duration-300 hover:text-stone-400 md:text-sm"
                    style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
                  >
                    {footerData.subtitle}
                  </motion.p>
                </motion.div>
              </div>

              {/* Copyright + socials */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6, duration: 0.6 }}
                className="text-left md:text-right"
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.5 }}
                  className="mb-2 font-sans text-stone-600 text-xs transition-colors duration-300 hover:text-stone-500 md:mb-3 md:text-sm"
                  style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
                >
                  {footerData.copyright}
                </motion.p>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 2, staggerChildren: 0.1 }}
                  className="flex gap-2 md:gap-3"
                >
                  {footerData.social.map((s, i) => (
                    <SocialLink key={s.label} href={s.href} label={s.label} Icon={s.Icon} index={i} />
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
