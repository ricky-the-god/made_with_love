import { type NextRequest, NextResponse } from "next/server";

import { groq } from "@/lib/groq/client";

const SYSTEM_PROMPT = `You are a warm family recipe assistant helping preserve traditional recipes.
When asked to suggest ingredients and steps, always respond in exactly this format with no extra text:

===INGREDIENTS===
[one ingredient per line with quantities, e.g. "2 cups all-purpose flour"]
===STEPS===
[numbered steps, one per line, e.g. "1. Preheat oven to 180°C."]

Be practical and culturally sensitive. Default to 4 servings unless told otherwise.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, memberName } = body as { title?: string; memberName?: string };

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const userPrompt = memberName
      ? `Suggest ingredients and steps for "${title.trim()}", a recipe traditionally made by ${memberName}.`
      : `Suggest ingredients and steps for "${title.trim()}".`;

    const groqStream = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of groqStream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
        } catch {
          controller.enqueue(new TextEncoder().encode("\n[AI error — please try again]"));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch {
    return NextResponse.json({ error: "AI suggestion failed" }, { status: 500 });
  }
}
