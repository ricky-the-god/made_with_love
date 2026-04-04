import { type NextRequest, NextResponse } from "next/server";

import { groq } from "@/lib/groq/client";

const SYSTEM_PROMPT = `You extract handwritten or printed recipe text from images.
Return ONLY valid JSON, with no markdown or extra text:
{
  "title": "string",
  "ingredients": "one ingredient per line",
  "steps": "numbered steps, one per line",
  "notes": "short optional notes or empty string",
  "confidence_note": "brief note about uncertain/illegible parts"
}
Rules:
- Preserve original wording where possible.
- Do not invent ingredients, quantities, or steps.
- If uncertain, keep best guess and mention uncertainty in confidence_note.
- If title is missing, infer a short neutral title from visible content.`;

function parseJsonPayload(rawText: string) {
  const trimmed = rawText.trim();
  const withoutFence = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  return JSON.parse(withoutFence) as {
    title?: unknown;
    ingredients?: unknown;
    steps?: unknown;
    notes?: unknown;
    confidence_note?: unknown;
  };
}

function toExtractedRecipe(parsed: ReturnType<typeof parseJsonPayload>) {
  return {
    title: typeof parsed.title === "string" ? parsed.title.trim() : "",
    ingredients: typeof parsed.ingredients === "string" ? parsed.ingredients.trim() : "",
    steps: typeof parsed.steps === "string" ? parsed.steps.trim() : "",
    notes: typeof parsed.notes === "string" ? parsed.notes.trim() : "",
    confidence_note: typeof parsed.confidence_note === "string" ? parsed.confidence_note.trim() : "",
  };
}

async function extractWithGroq(args: { imageUrl: string }) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const completion = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    stream: false,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: "Extract this recipe image into the required JSON format." },
          {
            type: "image_url",
            image_url: {
              url: args.imageUrl,
            },
          },
        ] as unknown as string,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "";
  const rawText = typeof raw === "string" ? raw : String(raw);

  return toExtractedRecipe(parseJsonPayload(rawText));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl } = body as { imageUrl?: string };

    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY is not configured" }, { status: 500 });
    }

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json({ error: "Could not fetch image for extraction" }, { status: 400 });
    }

    const contentType = imageResponse.headers.get("content-type")?.toLowerCase() ?? "image/jpeg";
    const normalizedType = contentType.split(";")[0]?.trim() || "image/jpeg";
    const supportedMediaTypes = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

    if (!supportedMediaTypes.has(normalizedType)) {
      return NextResponse.json(
        { error: "Unsupported image type for AI extraction. Please use JPG, PNG, GIF, or WebP." },
        { status: 400 },
      );
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const bytes = Buffer.from(arrayBuffer);

    if (bytes.length > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be 10 MB or smaller" }, { status: 400 });
    }

    let extracted: ReturnType<typeof toExtractedRecipe> | null = null;

    try {
      extracted = await extractWithGroq({ imageUrl });
    } catch {
      return NextResponse.json({ error: "Recipe extraction failed" }, { status: 502 });
    }

    if (!extracted || (!extracted.ingredients && !extracted.steps)) {
      return NextResponse.json({ error: "Could not extract recipe text" }, { status: 422 });
    }

    return NextResponse.json(extracted);
  } catch {
    return NextResponse.json({ error: "Recipe extraction failed" }, { status: 500 });
  }
}
