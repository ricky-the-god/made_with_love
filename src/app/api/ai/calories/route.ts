import { type NextRequest, NextResponse } from "next/server";

import { groq } from "@/lib/groq/client";

const SYSTEM_PROMPT = `You are a nutrition expert. Given a list of ingredients and optional serving count,
estimate the total and per-serving calorie content.

Respond with ONLY a valid JSON object — no markdown, no explanation, no code fences:
{
  "calories_per_serving": <number>,
  "total_calories": <number>,
  "servings": <number>,
  "note": "<brief disclaimer about estimate accuracy>"
}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ingredients, servings } = body as { ingredients?: string; servings?: string };

    if (!ingredients || typeof ingredients !== "string" || !ingredients.trim()) {
      return NextResponse.json({ error: "ingredients is required" }, { status: 400 });
    }

    const userPrompt = servings
      ? `Ingredients:\n${ingredients.trim()}\n\nServings: ${servings}`
      : `Ingredients:\n${ingredients.trim()}\n\nAssume 4 servings.`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      stream: false,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed.calories_per_serving !== "number") {
        return NextResponse.json({ calories_per_serving: null, error: "Could not parse estimate" });
      }
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({ calories_per_serving: null, error: "Could not estimate calories" });
    }
  } catch {
    return NextResponse.json({ calories_per_serving: null, error: "AI request failed" }, { status: 500 });
  }
}
