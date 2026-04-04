import { type NextRequest, NextResponse } from "next/server";

import { groq } from "@/lib/groq/client";

type ImageKey =
  | "prep-chop"
  | "mix-marinade"
  | "simmer-pot"
  | "pan-fry"
  | "bake-oven"
  | "steam-basket"
  | "noodle-wok"
  | "serve-bowl";

const IMAGE_MAP: Record<ImageKey, string> = {
  "prep-chop": "/images/steps/prep-chop.svg",
  "mix-marinade": "/images/steps/mix-marinade.svg",
  "simmer-pot": "/images/steps/simmer-pot.svg",
  "pan-fry": "/images/steps/pan-fry.svg",
  "bake-oven": "/images/steps/bake-oven.svg",
  "steam-basket": "/images/steps/steam-basket.svg",
  "noodle-wok": "/images/steps/noodle-wok.svg",
  "serve-bowl": "/images/steps/serve-bowl.svg",
};

const IMAGE_CATALOG = [
  { key: "prep-chop", description: "Prepping ingredients: chopping, slicing, washing, arranging ingredients." },
  {
    key: "mix-marinade",
    description: "Mixing sauces, whisking batter, marinating, combining wet and dry ingredients.",
  },
  { key: "simmer-pot", description: "Boiling, simmering, braising, stewing in a pot or broth." },
  { key: "pan-fry", description: "Pan-frying, shallow frying, sauteing in a skillet." },
  { key: "bake-oven", description: "Baking, roasting, oven cooking." },
  { key: "steam-basket", description: "Steaming in basket or covered steamer." },
  { key: "noodle-wok", description: "Noodle tossing, stir-frying in wok." },
  { key: "serve-bowl", description: "Final plating, serving, garnishing, ready to eat." },
] as const;

function keywordFallback(step: string): ImageKey {
  const s = step.toLowerCase();
  if (/serve|plate|garnish|enjoy|pour.*over/.test(s)) return "serve-bowl";
  if (/steam|tamale/.test(s)) return "steam-basket";
  if (/bake|roast|oven/.test(s)) return "bake-oven";
  if (/fry|saute|sear|crisp/.test(s)) return "pan-fry";
  if (/wok|noodle|toss/.test(s)) return "noodle-wok";
  if (/simmer|boil|broth|stew|braise|cook.*pot/.test(s)) return "simmer-pot";
  if (/mix|whisk|combine|marinate|batter|stir/.test(s)) return "mix-marinade";
  return "prep-chop";
}

function parseKey(raw: string): ImageKey | null {
  const lower = raw.toLowerCase();
  const found = IMAGE_CATALOG.find((item) => lower.includes(item.key));
  return found?.key ?? null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { step, recipeTitle } = body as { step?: string; recipeTitle?: string };

    if (!step?.trim()) {
      return NextResponse.json({ error: "step is required" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      const fallbackKey = keywordFallback(step);
      return NextResponse.json({ imagePath: IMAGE_MAP[fallbackKey], imageKey: fallbackKey, source: "fallback" });
    }

    const systemPrompt = `You choose the best step illustration category for a cooking step.
Return ONLY one key from this list:
${IMAGE_CATALOG.map((item) => `- ${item.key}: ${item.description}`).join("\n")}
No extra words.`;

    const userPrompt = `Recipe: ${recipeTitle ?? "Unknown"}\nStep: ${step}`;

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0,
      max_tokens: 20,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = response.choices[0]?.message?.content ?? "";
    const parsedKey = parseKey(raw) ?? keywordFallback(step);

    return NextResponse.json({ imagePath: IMAGE_MAP[parsedKey], imageKey: parsedKey, source: "groq" });
  } catch {
    return NextResponse.json({ error: "Failed to choose step image" }, { status: 500 });
  }
}
