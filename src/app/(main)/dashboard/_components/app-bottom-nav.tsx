"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BookOpen, Compass, TreeDeciduous } from "lucide-react";

import type { AppCopyKey } from "@/lib/i18n/copy";
import { useAppCopy } from "@/lib/i18n/use-app-copy";
import { cn } from "@/lib/utils";

const tabs = [
  { titleKey: "navTree", url: "/dashboard/tree", icon: TreeDeciduous },
  { titleKey: "navRecipes", url: "/dashboard/recipes", icon: BookOpen },
  { titleKey: "navDiscover", url: "/dashboard/discover", icon: Compass },
] as const satisfies ReadonlyArray<{ titleKey: AppCopyKey; url: string; icon: typeof TreeDeciduous }>;

export function AppBottomNav() {
  const pathname = usePathname();
  const copy = useAppCopy();

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 flex h-16 items-stretch border-t bg-background md:hidden">
      {tabs.map(({ titleKey, url, icon: Icon }) => {
        const isActive = pathname.startsWith(url);
        const title = copy[titleKey];
        return (
          <Link
            key={url}
            href={url}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 text-xs transition-colors",
              isActive ? "text-amber-700" : "text-muted-foreground hover:text-amber-700",
            )}
          >
            <Icon className={cn("size-5", isActive && "text-amber-700")} strokeWidth={isActive ? 2.2 : 1.8} />
            <span className={cn("font-medium", isActive && "text-amber-700")}>{title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
