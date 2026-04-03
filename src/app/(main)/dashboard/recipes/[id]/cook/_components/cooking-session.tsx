"use client";

import { useEffect, useState } from "react";

import { ArrowLeft, ArrowRight, CheckCircle, ChefHat, List, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";

interface CookingSessionProps {
  recipeId: string;
  recipeTitle: string;
  steps: string[];
  ingredients: string;
}

export function CookingSession({ recipeId, recipeTitle, steps, ingredients }: CookingSessionProps) {
  // currentStep: -1 = ingredients intro, 0..steps.length-1 = recipe steps
  const hasIngredients = ingredients.trim().length > 0;
  const hasSteps = steps.length > 0;
  const [currentStep, setCurrentStep] = useState(-1);
  const [completed, setCompleted] = useState(false);
  const [grandmaTip, setGrandmaTip] = useState("");
  const [isTipLoading, setIsTipLoading] = useState(false);

  const ingredientLines = hasIngredients ? ingredients.split("\n").filter((l) => l.trim()) : [];

  // Total "screens": ingredients intro (if present) + steps
  const totalScreens = (hasIngredients ? 1 : 0) + steps.length;
  const currentScreenIndex = hasIngredients ? currentStep + 1 : currentStep;
  const progress = totalScreens > 0 ? ((currentScreenIndex + 1) / totalScreens) * 100 : 100;

  const isOnIngredients = currentStep === -1;
  const isLastStep = !isOnIngredients && currentStep === steps.length - 1;

  // Fetch Groq tip whenever the step changes
  useEffect(() => {
    if (isOnIngredients || steps.length === 0) {
      setGrandmaTip("");
      setIsTipLoading(false);
      return;
    }

    const currentStepText = steps[currentStep];
    if (!currentStepText) return;

    let cancelled = false;
    setGrandmaTip("");
    setIsTipLoading(true);

    async function fetchTip() {
      try {
        const response = await fetch("/api/ai/cooking-tip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            step: currentStepText,
            title: recipeTitle,
            stepIndex: currentStep,
            totalSteps: steps.length,
          }),
        });

        if (!response.ok || !response.body) return;

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done || cancelled) break;
          const chunk = decoder.decode(value, { stream: true });
          setGrandmaTip((prev) => prev + chunk);
        }
      } catch {
        // Silently fail — static fallback shown when grandmaTip is empty
      } finally {
        if (!cancelled) setIsTipLoading(false);
      }
    }

    fetchTip();

    return () => {
      cancelled = true;
    };
  }, [currentStep, isOnIngredients, steps, recipeTitle]);

  function goNext() {
    if (isLastStep) {
      setCompleted(true);
    } else {
      setCurrentStep((s) => s + 1);
    }
  }

  function goPrev() {
    if (isOnIngredients) return;
    setCurrentStep((s) => s - 1);
  }

  const canGoPrev = !(isOnIngredients || (!hasIngredients && currentStep === 0));

  if (completed) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6 text-center">
        <div className="text-8xl">🍽️</div>
        <div>
          <h1 className="font-bold text-3xl">You did it!</h1>
          <p className="mt-2 text-muted-foreground">
            You just made <span className="font-medium text-foreground">{recipeTitle}</span> with love. Enjoy every
            bite.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild className="bg-amber-700 text-white hover:bg-amber-800">
            <a href={`/dashboard/recipes/${recipeId}`}>Back to recipe</a>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setCurrentStep(-1);
              setCompleted(false);
            }}
          >
            Cook again
          </Button>
        </div>
      </div>
    );
  }

  // No steps at all — friendly fallback
  if (!hasIngredients && !hasSteps) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-6 py-24 text-center">
        <div className="text-6xl">📝</div>
        <div>
          <h2 className="font-semibold text-xl">No steps written yet</h2>
          <p className="mt-2 text-muted-foreground text-sm">Add ingredients and steps to this recipe before cooking.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild className="bg-amber-700 text-white hover:bg-amber-800">
            <a href={`/dashboard/recipes/${recipeId}/edit`}>Edit recipe</a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`/dashboard/recipes/${recipeId}`}>Back to recipe</a>
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
          <a href={`/dashboard/recipes/${recipeId}`}>
            <X className="size-4" />
          </a>
        </Button>
        <div className="text-center">
          <p className="font-medium text-sm">{recipeTitle}</p>
          <p className="text-muted-foreground text-xs">
            {isOnIngredients ? "Ingredients" : `Step ${currentStep + 1} of ${steps.length}`}
          </p>
        </div>
        <div className="w-9" />
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-1.5" />

      {/* Content card */}
      {isOnIngredients ? (
        <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-8 dark:border-amber-900/20 dark:bg-amber-950/10">
          <div className="mb-2 flex items-center gap-2 text-amber-700 text-sm dark:text-amber-400">
            <List className="size-4" />
            <span>Before you start</span>
          </div>
          <h2 className="mb-4 font-bold text-2xl">Here's what you'll need</h2>
          <ul className="flex flex-col gap-2">
            {ingredientLines.map((line, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: ordered list
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-400" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-8 dark:border-amber-900/20 dark:bg-amber-950/10">
          <div className="mb-2 flex items-center gap-2 text-amber-700 text-sm dark:text-amber-400">
            <ChefHat className="size-4" />
            <span>Step {currentStep + 1}</span>
          </div>
          <p className="text-foreground text-lg leading-relaxed">{steps[currentStep]}</p>
        </div>
      )}

      {/* Grandmother guide with Groq tip */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 border-dashed px-4 py-3 text-muted-foreground text-sm dark:border-amber-900/30">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xl dark:bg-amber-900/30">
          👵
        </div>
        {isTipLoading && !grandmaTip ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Spinner className="size-3.5" />
            <span className="italic">Thinking of a tip...</span>
          </div>
        ) : (
          <p className="italic">
            {grandmaTip ||
              (isOnIngredients
                ? "Get everything ready before you start — it makes all the difference."
                : "Take your time. This dish was made with love and patience.")}
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={goPrev} disabled={!canGoPrev} className="flex-1">
          <ArrowLeft className="size-4" />
          Previous
        </Button>
        {isLastStep ? (
          <Button onClick={goNext} className="flex-1 bg-green-700 text-white hover:bg-green-800">
            <CheckCircle className="size-4" />
            Done!
          </Button>
        ) : (
          <Button onClick={goNext} className="flex-1 bg-amber-700 text-white hover:bg-amber-800">
            {isOnIngredients ? "Start cooking" : "Next step"}
            <ArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
