import { BookOpen, Compass, Heart, type LucideIcon, TreeDeciduous, User } from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon: LucideIcon;
  subItems?: NavSubItem[];
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
      { title: "Favorites", url: "/dashboard/favorites", icon: Heart },
      { title: "Profile", url: "/dashboard/profile", icon: User },
    ],
  },
];
