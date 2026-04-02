"use client";

import Link from "next/link";

import { LogOut, Settings, User, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { signOut } from "@/server/auth-actions";

export function ProfileSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="size-5" />
          <span className="sr-only">Open account menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl pb-8">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-left font-serif text-lg">Account</SheetTitle>
        </SheetHeader>

        {/* Avatar section */}
        <div className="mb-6 flex items-center gap-3">
          <Avatar className="size-12 rounded-xl bg-amber-100">
            <AvatarFallback className="rounded-xl bg-amber-100 font-semibold text-amber-700">Me</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">Your Account</span>
            <span className="text-muted-foreground text-xs">Family member</span>
          </div>
        </div>

        {/* Link rows */}
        <nav className="flex flex-col gap-1">
          <Link
            href="/dashboard/profile/family"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-amber-50 hover:text-amber-700"
          >
            <Users className="size-4 text-amber-700" />
            <span>Family Management</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-amber-50 hover:text-amber-700"
          >
            <Settings className="size-4 text-amber-700" />
            <span>Account Settings</span>
          </Link>
        </nav>

        <Separator className="my-4" />

        {/* Sign out */}
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-destructive text-sm transition-colors hover:bg-destructive/10"
          >
            <LogOut className="size-4" />
            <span>Sign out</span>
          </button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
