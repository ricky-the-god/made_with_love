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
  stepImages?: string[];
  ingredients: string;
}

export function CookingSession({ recipeId, recipeTitle, steps, stepImages = [], ingredients }: CookingSessionProps) {
  // currentStep: -1 = ingredients intro, 0..steps.length-1 = recipe steps
  const hasIngredients = ingredients.trim().length > 0;
  const hasSteps = steps.length > 0;
  const [currentStep, setCurrentStep] = useState(-1);
  const [completed, setCompleted] = useState(false);
  const [grandmaTip, setGrandmaTip] = useState("");
  const [isTipLoading, setIsTipLoading] = useState(false);
  const [aiImageByStep, setAiImageByStep] = useState<Record<number, string>>({});
  const [aiImageSourceByStep, setAiImageSourceByStep] = useState<Record<number, "groq" | "fallback" | undefined>>({});

  const ingredientLines = hasIngredients ? ingredients.split("\n").filter((l) => l.trim()) : [];

  // Total "screens": ingredients intro (if present) + steps
  const totalScreens = (hasIngredients ? 1 : 0) + steps.length;
  const currentScreenIndex = hasIngredients ? currentStep + 1 : currentStep;
  const progress = totalScreens > 0 ? ((currentScreenIndex + 1) / totalScreens) * 100 : 100;

  const isOnIngredients = currentStep === -1;
  const isLastStep = !isOnIngredients && currentStep === steps.length - 1;
  const currentStepImage = !isOnIngredients ? (aiImageByStep[currentStep] ?? stepImages[currentStep]) : undefined;
  const isAiPickedImage = !isOnIngredients && aiImageSourceByStep[currentStep] === "groq";

  useEffect(() => {
    if (isOnIngredients) return;
    if (!steps[currentStep]) return;
    if (aiImageByStep[currentStep]) return;

    let cancelled = false;

    async function fetchStepImage() {
      try {
        const response = await fetch("/api/ai/step-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            step: steps[currentStep],
            recipeTitle,
          }),
        });

        if (!response.ok) return;

        const data = (await response.json()) as { imagePath?: string; source?: "groq" | "fallback" };
        if (!cancelled && data.imagePath) {
          setAiImageByStep((prev) => ({ ...prev, [currentStep]: data.imagePath ?? "" }));
          setAiImageSourceByStep((prev) => ({ ...prev, [currentStep]: data.source }));
        }
      } catch {
        // Silent fallback to seeded image mapping
      }
    }

    fetchStepImage();

    return () => {
      cancelled = true;
    };
  }, [isOnIngredients, currentStep, steps, recipeTitle, aiImageByStep]);

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
          <h1 className="font-bold text-4xl">You did it!</h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
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
          <h2 className="font-semibold text-2xl">No steps written yet</h2>
          <p className="mt-2 text-base text-muted-foreground">
            Add ingredients and steps to this recipe before cooking.
          </p>
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
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 pb-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" asChild>
          <a href={`/dashboard/recipes/${recipeId}`}>
            <X className="size-4" />
          </a>
        </Button>
        <div className="text-center">
          <p className="font-semibold text-base sm:text-lg">{recipeTitle}</p>
          <p className="text-muted-foreground text-sm">
            {isOnIngredients ? "Ingredients" : `Step ${currentStep + 1} of ${steps.length}`}
          </p>
        </div>
        <div className="w-9" />
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-2" />

      {/* Content card */}
      {isOnIngredients ? (
        <div className="rounded-3xl border border-amber-100 bg-amber-50/30 p-6 sm:p-10 md:p-12 dark:border-amber-900/20 dark:bg-amber-950/10">
          <div className="mb-3 flex items-center gap-2 text-amber-700 text-base dark:text-amber-400">
            <List className="size-5" />
            <span>Before you start</span>
          </div>
          <h2 className="mb-6 font-bold text-3xl sm:text-4xl">Here's what you'll need</h2>
          <ul className="flex flex-col gap-3 sm:gap-4">
            {ingredientLines.map((line, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: ordered list
              <li key={i} className="flex items-start gap-3 text-base leading-relaxed sm:text-lg">
                <span className="mt-2 size-2 shrink-0 rounded-full bg-amber-400" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-3xl border border-amber-100 bg-amber-50/30 p-6 sm:p-10 md:p-12 dark:border-amber-900/20 dark:bg-amber-950/10">
          <div className="mb-4 flex items-center gap-2 text-amber-700 text-base dark:text-amber-400">
            <ChefHat className="size-5" />
            <span>Step {currentStep + 1}</span>
          </div>
          {currentStepImage && (
            <div className="relative mb-6 overflow-hidden rounded-2xl border border-amber-200/70 bg-amber-100/20 dark:border-amber-900/40">
              {isAiPickedImage && (
                <span className="absolute right-3 top-3 z-10 rounded-full bg-[#322c2b]/90 px-3 py-1 text-[11px] text-white uppercase tracking-wide">
                  AI-picked image
                </span>
              )}
              <img
                src={currentStepImage}
                alt={`Step ${currentStep + 1} illustration for ${recipeTitle}`}
                className="h-52 w-full object-cover sm:h-64 md:h-72"
                loading="lazy"
              />
            </div>
          )}
          <p className="text-foreground text-xl leading-relaxed sm:text-2xl">{steps[currentStep]}</p>
        </div>
      )}

      {/* Grandmother guide with Groq tip */}
      <div className="flex items-start gap-4 rounded-2xl border border-amber-200 border-dashed px-5 py-4 text-base text-muted-foreground dark:border-amber-900/30">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-2xl dark:bg-amber-900/30">
          👵
        </div>
        {isTipLoading && !grandmaTip ? (
          <div className="flex items-center gap-2 text-base text-muted-foreground">
            <Spinner className="size-4" />
            <span className="italic">Thinking of a tip...</span>
          </div>
        ) : (
          <p className="italic leading-relaxed">
            {grandmaTip ||
              (isOnIngredients
                ? "Get everything ready before you start — it makes all the difference."
                : "Take your time. This dish was made with love and patience.")}
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={!canGoPrev}
          className="h-12 flex-1 text-base sm:h-14 sm:text-lg"
        >
          <ArrowLeft className="size-4 sm:size-5" />
          Previous
        </Button>
        {isLastStep ? (
          <Button
            onClick={goNext}
            className="h-12 flex-1 bg-green-700 text-base text-white hover:bg-green-800 sm:h-14 sm:text-lg"
          >
            <CheckCircle className="size-4 sm:size-5" />
            Done!
          </Button>
        ) : (
          <Button
            onClick={goNext}
            className="h-12 flex-1 bg-amber-700 text-base text-white hover:bg-amber-800 sm:h-14 sm:text-lg"
          >
            {isOnIngredients ? "Start cooking" : "Next step"}
            <ArrowRight className="size-4 sm:size-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
