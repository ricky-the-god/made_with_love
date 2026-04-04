import { HeroSection } from "./_components/hero-section";
import { LandingNav } from "./_components/landing-nav";
import { LandingSections } from "./_components/landing-sections";
import { StickyFooter } from "./_components/sticky-footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fcf8f2]">
      {/* ─── Nav ─────────────────────────────────────────────────────────── */}
      <LandingNav />

      <main>
        {/* ─── Cinematic scroll hero (3 frames) ───────────────────────────── */}
        <HeroSection />

        {/* ─── Lower page sections (animated on scroll entry) ─────────────── */}
        <LandingSections />
      </main>

      {/* ─── Sticky footer ───────────────────────────────────────────────── */}
      <StickyFooter />
    </div>
  );
}
