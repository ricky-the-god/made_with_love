import type { ReactNode } from "react";

import { Heart } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { APP_CONFIG } from "@/config/app-config";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main>
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        <div className="relative order-2 hidden h-full rounded-3xl bg-amber-800 lg:flex">
          <div className="absolute top-10 space-y-1 px-10 text-amber-50">
            <Heart className="size-10" />
            <h1 className="font-medium text-2xl">{APP_CONFIG.name}</h1>
            <p className="text-sm text-amber-200">Preserve the recipes that hold your family together.</p>
          </div>

          <div className="absolute bottom-10 flex w-full justify-between px-10">
            <div className="flex-1 space-y-1 text-amber-50">
              <h2 className="font-medium">Every recipe has a story.</h2>
              <p className="text-sm text-amber-200">
                Attach memories, photos, and voice notes to keep the person behind the dish alive.
              </p>
            </div>
            <Separator orientation="vertical" className="mx-3 h-auto! bg-amber-600" />
            <div className="flex-1 space-y-1 text-amber-50">
              <h2 className="font-medium">Your family tree, full of flavor.</h2>
              <p className="text-sm text-amber-200">
                Browse recipes by generation, explore cultural traditions, and cook together across distances.
              </p>
            </div>
          </div>
        </div>
        <div className="relative order-1 flex h-full">{children}</div>
      </div>
    </main>
  );
}
