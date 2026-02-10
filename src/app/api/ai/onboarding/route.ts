import { streamText } from "ai";
import { models } from "@/lib/ai/providers";
import { onboardingPrompt } from "@/lib/ai/prompts/onboarding";

export async function POST(req: Request) {
  const { messages, step, collectedData } = await req.json();

  const systemPrompt = onboardingPrompt({
    step: step || 1,
    collectedData: collectedData || {},
  });

  const result = streamText({
    model: models.onboarding,
    system: systemPrompt,
    messages,
    temperature: 0.8,
  });

  return result.toTextStreamResponse();
}
