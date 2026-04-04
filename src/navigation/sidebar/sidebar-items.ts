import { BookOpen, Compass, type LucideIcon, TreeDeciduous, Users } from "lucide-react";

import type { AppCopyKey } from "@/lib/i18n/copy";

export interface NavSubItem {
  titleKey: AppCopyKey;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  titleKey: AppCopyKey;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    items: [
      { titleKey: "navTree", url: "/dashboard/tree", icon: TreeDeciduous },
      { titleKey: "navRecipes", url: "/dashboard/recipes", icon: BookOpen },
      { titleKey: "navDiscover", url: "/dashboard/discover", icon: Compass },
      { titleKey: "navFriends", url: "/dashboard/friends", icon: Users },
    ],
  },
];
