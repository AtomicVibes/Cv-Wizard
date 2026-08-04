import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export function getGoogleGenAIApiKey(): string | undefined {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    undefined
  );
}

// Strict env validation: fail fast with a descriptive error instead of letting
// Genkit crash with a cryptic production 500 when the key is not configured.
export function assertGeminiApiKey(): string {
  const apiKey = getGoogleGenAIApiKey();
  if (!apiKey) {
    throw new Error(
      'Missing GEMINI_API_KEY environment variable. Set GEMINI_API_KEY (or GOOGLE_GENAI_API_KEY) in .env.local and in your Vercel project environment variables to enable the AI feature.'
    );
  }
  return apiKey;
}

let aiInstance: ReturnType<typeof genkit> | undefined;

// Lazy init: module evaluation is side-effect free so a missing or invalid
// API key can never crash module loading and turn into an unhandled
// Server Component 500. Errors surface inside the server action instead,
// where they are caught and reported cleanly.
export function getGenkitAI(): ReturnType<typeof genkit> {
  if (!aiInstance) {
    aiInstance = genkit({
      plugins: [
        googleAI({
          apiKey: getGoogleGenAIApiKey(),
        }),
      ],
    });
  }
  return aiInstance;
}