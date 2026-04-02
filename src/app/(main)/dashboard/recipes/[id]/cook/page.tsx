"use client";

import { useState } from "react";

import { ArrowLeft, ArrowRight, CheckCircle, ChefHat, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const PLACEHOLDER_STEPS = [
  {
    step: 1,
    title: "Prepare your ingredients",
    instruction: "Gather all ingredients listed above. Rinse and prep everything before you start cooking.",
    tip: "Having everything ready makes the process much smoother.",
  },
  {
    step: 2,
    title: "Begin cooking",
    instruction: "Follow your recipe steps here. Each step will guide you through the process one at a time.",
    tip: "Take your time — there's no rush.",
  },
  {
    step: 3,
    title: "Taste and adjust",
    instruction: "As you cook, taste regularly and adjust seasoning to match how your family member made it.",
    tip: "Trust your taste. Recipes are guides, not rules.",
  },
];

export default function GuidedCookingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const step = PLACEHOLDER_STEPS[currentStep];
  const progress = ((currentStep + 1) / PLACEHOLDER_STEPS.length) * 100;

  if (completed) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6 text-center">
        <div className="text-8xl">🍽️</div>
        <div>
          <h1 className="font-bold text-3xl">You did it!</h1>
          <p className="mt-2 text-muted-foreground">You just made a family recipe with love. Enjoy every bite.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild className="bg-amber-700 text-white hover:bg-amber-800">
            <a href="/dashboard/recipes">Back to recipes</a>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setCurrentStep(0);
              setCompleted(false);
            }}
          >
            Cook again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" asChild>
          <a href="/dashboard/recipes">
            <X className="size-4" />
          </a>
        </Button>
        <div className="text-center">
          <p className="text-muted-foreground text-xs">
            Step {currentStep + 1} of {PLACEHOLDER_STEPS.length}
          </p>
        </div>
        <div className="w-9" />
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-1.5" />

      {/* Step card */}
      <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-8 dark:border-amber-900/20 dark:bg-amber-950/10">
        <div className="mb-2 flex items-center gap-2 text-amber-700 text-sm dark:text-amber-400">
          <ChefHat className="size-4" />
          <span>Step {step.step}</span>
        </div>
        <h2 className="mb-4 font-bold text-2xl">{step.title}</h2>
        <p className="text-lg leading-relaxed text-foreground">{step.instruction}</p>
        {step.tip && (
          <div className="mt-6 rounded-lg bg-amber-100/60 px-4 py-3 text-sm dark:bg-amber-900/20">
            <span className="font-medium text-amber-800 dark:text-amber-300">Tip: </span>
            <span className="text-muted-foreground">{step.tip}</span>
          </div>
        )}
      </div>

      {/* Animated guide avatar placeholder */}
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-amber-200 px-4 py-3 text-sm text-muted-foreground dark:border-amber-900/30">
        <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 text-xl dark:bg-amber-900/30">
          👵
        </div>
        <p className="italic">Animated family guide will appear here to walk you through each step with warmth.</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="flex-1"
        >
          <ArrowLeft className="size-4" />
          Previous
        </Button>
        {currentStep < PLACEHOLDER_STEPS.length - 1 ? (
          <Button
            onClick={() => setCurrentStep((s) => s + 1)}
            className="flex-1 bg-amber-700 text-white hover:bg-amber-800"
          >
            Next step
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button onClick={() => setCompleted(true)} className="flex-1 bg-green-700 text-white hover:bg-green-800">
            <CheckCircle className="size-4" />
            Done!
          </Button>
        )}
      </div>
    </div>
  );
}
