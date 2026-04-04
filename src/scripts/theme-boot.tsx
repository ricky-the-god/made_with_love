// Plain <script> in a Server Component — React 19 / Next.js App Router hoists
// this to <head> automatically. next/script with beforeInteractive triggers a
// React 19 console warning and is not needed for static public scripts.
export function ThemeBootScript() {
  return <script src="/theme-boot.js" />;
}
