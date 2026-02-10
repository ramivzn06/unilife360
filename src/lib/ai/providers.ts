import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const models = {
  financialAdvisor: google("gemini-2.0-flash"),
  tutor: google("gemini-2.0-flash"),
  scheduler: google("gemini-2.0-flash"),
  summarizer: google("gemini-2.0-flash"),
  examGenerator: google("gemini-2.0-flash"),
  onboarding: google("gemini-2.0-flash"),
};
