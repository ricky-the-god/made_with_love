import type { ReactNode } from "react";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="h-dvh w-full">
      <div className="relative flex h-full w-full">{children}</div>
    </main>
  );
}
