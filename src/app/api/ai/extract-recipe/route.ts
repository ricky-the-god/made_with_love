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

  const objectStart = withoutFence.indexOf("{");
  const objectEnd = withoutFence.lastIndexOf("}");
  const jsonCandidate =
    objectStart >= 0 && objectEnd > objectStart ? withoutFence.slice(objectStart, objectEnd + 1) : withoutFence;

  return JSON.parse(jsonCandidate) as {
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

function toDataUrl(mimeType: string, bytes: Buffer) {
  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) {
    return null;
  }

  const mimeType = match[1]?.toLowerCase() ?? "";
  const base64 = match[2] ?? "";

  return {
    mimeType,
    bytes: Buffer.from(base64, "base64"),
  };
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
    const supportedMediaTypes = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

    let groqImageUrl: string | null = null;
    let normalizedType = "image/jpeg";
    let byteLength = 0;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const image = formData.get("image");

      if (!(image instanceof File)) {
        return NextResponse.json({ error: "image file is required" }, { status: 400 });
      }

      normalizedType = image.type.toLowerCase() || "image/jpeg";
      const bytes = Buffer.from(await image.arrayBuffer());
      byteLength = bytes.length;
      groqImageUrl = toDataUrl(normalizedType, bytes);
    } else {
      const body = await request.json();
      const { imageUrl, imageDataUrl } = body as { imageUrl?: string; imageDataUrl?: string };

      if (typeof imageDataUrl === "string" && imageDataUrl.trim()) {
        const parsed = parseDataUrl(imageDataUrl.trim());

        if (!parsed) {
          return NextResponse.json({ error: "Invalid uploaded image payload" }, { status: 400 });
        }

        normalizedType = parsed.mimeType;
        byteLength = parsed.bytes.length;
        groqImageUrl = imageDataUrl.trim();
      } else if (typeof imageUrl === "string" && imageUrl.trim()) {
        groqImageUrl = imageUrl;

        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          return NextResponse.json({ error: "Could not fetch image for extraction" }, { status: 400 });
        }

        const remoteType = imageResponse.headers.get("content-type")?.toLowerCase() ?? "image/jpeg";
        normalizedType = remoteType.split(";")[0]?.trim() || "image/jpeg";

        const arrayBuffer = await imageResponse.arrayBuffer();
        byteLength = Buffer.from(arrayBuffer).length;
      } else {
        return NextResponse.json({ error: "image file, imageUrl, or imageDataUrl is required" }, { status: 400 });
      }
    }

    if (!supportedMediaTypes.has(normalizedType)) {
      return NextResponse.json(
        { error: "Unsupported image type for AI extraction. Please use JPG, PNG, GIF, or WebP." },
        { status: 400 },
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY is not configured" }, { status: 500 });
    }

    if (byteLength > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be 10 MB or smaller" }, { status: 400 });
    }

    let extracted: ReturnType<typeof toExtractedRecipe> | null = null;

    try {
      extracted = await extractWithGroq({ imageUrl: groqImageUrl });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Recipe extraction failed";
      return NextResponse.json({ error: message }, { status: 502 });
    }

    if (!extracted || (!extracted.ingredients && !extracted.steps)) {
      return NextResponse.json({ error: "Could not extract recipe text" }, { status: 422 });
    }

    return NextResponse.json(extracted);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Recipe extraction failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
