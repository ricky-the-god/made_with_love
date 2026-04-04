import { type NextRequest, NextResponse } from "next/server";

import { groq } from "@/lib/groq/client";

const SYSTEM_PROMPT = `You are a warm, encouraging grandmother helping someone cook a family recipe.
Give a short, practical tip (2-3 sentences max) for the current cooking step.
Speak warmly but concisely. No emojis. Focus on technique, timing, or sensory cues
(smell, color, texture) that help the cook know they are doing it right.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { step, title, stepIndex, totalSteps } = body as {
      step?: string;
      title?: string;
      stepIndex?: number;
      totalSteps?: number;
    };

    if (!step || !title) {
      return NextResponse.json({ error: "step and title are required" }, { status: 400 });
    }

    const userPrompt = `Recipe: ${title}
Current step (${(stepIndex ?? 0) + 1} of ${totalSteps ?? 1}): ${step}

Give a short tip for this step.`;

    const groqStream = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      stream: true,
      max_tokens: 120,
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
          // Silently fail — client will show static fallback
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
    return NextResponse.json({ error: "AI tip failed" }, { status: 500 });
  }
}
