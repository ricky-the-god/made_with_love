"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BookOpen, Compass, Heart, TreeDeciduous, User } from "lucide-react";

import { cn } from "@/lib/utils";

const tabs = [
  { title: "Tree", url: "/dashboard/tree", icon: TreeDeciduous },
  { title: "Recipes", url: "/dashboard/recipes", icon: BookOpen },
  { title: "Discover", url: "/dashboard/discover", icon: Compass },
  { title: "Favorites", url: "/dashboard/favorites", icon: Heart },
  { title: "Profile", url: "/dashboard/profile", icon: User },
];

export function AppBottomNav() {
  const path = usePathname();

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center border-t bg-background/95 backdrop-blur-sm md:hidden">
      {tabs.map((tab) => {
        const isActive = path.startsWith(tab.url);
        return (
          <Link
            key={tab.title}
            href={tab.url}
            prefetch={false}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors",
              isActive ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <tab.icon className={cn("size-5 transition-transform", isActive && "scale-110")} />
            <span className={cn("font-medium", isActive && "font-semibold")}>{tab.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
