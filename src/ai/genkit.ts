import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// The @genkit-ai/google-genai plugin resolves the API key from the
// GEMINI_API_KEY / GOOGLE_API_KEY / GOOGLE_GENAI_API_KEY environment
// variables when not provided explicitly. The baseUrl must NOT be
// overridden - the plugin defaults to the official
// https://generativelanguage.googleapis.com endpoint. AIMLAPI keys only
// work against the AIMLAPI proxy endpoint, not Google's API, so they are
// not used as a fallback here.
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey:
        process.env.GEMINI_API_KEY ||
        process.env.GOOGLE_GENAI_API_KEY ||
        process.env.GOOGLE_API_KEY ||
        undefined,
    }),
  ],
});
