import { BookOpen, Compass, type LucideIcon, TreeDeciduous, Users } from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
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
      { title: "Tree", url: "/dashboard/tree", icon: TreeDeciduous },
      { title: "Recipes", url: "/dashboard/recipes", icon: BookOpen },
      { title: "Discover", url: "/dashboard/discover", icon: Compass },
      { title: "Friends", url: "/dashboard/friends", icon: Users },
    ],
  },
];
