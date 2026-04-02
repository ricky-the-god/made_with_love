"use client";

import { useState } from "react";

import { ArrowRight, BookOpen, Heart, TreeDeciduous, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const STEPS = [
  {
    id: 1,
    title: "Welcome to Made with Love",
    subtitle: "A place where your family's recipes, stories, and traditions live on.",
    icon: Heart,
  },
  {
    id: 2,
    title: "Create your family space",
    subtitle: "Give your family archive a name. You can always change it later.",
    icon: Users,
  },
  {
    id: 3,
    title: "Add your first family member",
    subtitle: "Start with yourself, a parent, or the relative whose cooking you want to preserve.",
    icon: TreeDeciduous,
  },
  {
    id: 4,
    title: "Your first recipe awaits",
    subtitle: "Upload a handwritten recipe card or create one from memory.",
    icon: BookOpen,
  },
  {
    id: 5,
    title: "Your family tree is ready",
    subtitle: "Tap any person in your tree to explore their recipes and memories.",
    icon: TreeDeciduous,
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const Icon = current.icon;
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-amber-50/30 p-6 dark:bg-background">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-8">
          <Progress value={progress} className="h-1" />
          <p className="mt-2 text-center text-muted-foreground text-xs">
            Step {step + 1} of {STEPS.length}
          </p>
        </div>

        <Card className="border-amber-100 shadow-sm dark:border-amber-900/20">
          <CardContent className="flex flex-col items-center gap-6 pt-10 pb-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              <Icon className="size-8" />
            </div>

            <div>
              <h1 className="font-bold text-2xl">{current.title}</h1>
              <p className="mt-2 text-muted-foreground leading-relaxed">{current.subtitle}</p>
            </div>

            {/* Step-specific inputs */}
            {step === 1 && (
              <div className="w-full flex flex-col gap-2 text-left">
                <Label htmlFor="family-name">Family name</Label>
                <Input id="family-name" placeholder="e.g. The Nguyen Family" className="text-center" />
              </div>
            )}
            {step === 2 && (
              <div className="w-full flex flex-col gap-2 text-left">
                <Label htmlFor="member-name">Their name</Label>
                <Input id="member-name" placeholder="e.g. Grandma Rosa" />
              </div>
            )}

            <div className="w-full flex flex-col gap-3">
              {step < STEPS.length - 1 ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  className="w-full bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
                >
                  {step === 0 ? "Get started" : "Continue"}
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button asChild className="w-full bg-amber-700 text-white hover:bg-amber-800">
                  <a href="/dashboard/tree">
                    <Heart className="size-4" />
                    Open my family tree
                  </a>
                </Button>
              )}
              {step > 0 && step < STEPS.length - 1 && (
                <Button variant="ghost" size="sm" asChild>
                  <a href="/dashboard/tree">Skip for now</a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
