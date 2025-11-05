import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Use Google's official Generative API base URL by default. Allow legacy
// AIMLAPI proxy key via AIMLAPI_KEY if present.
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_AI_API_KEY || process.env.AIMLAPI_KEY,
      baseUrl: 'https://generative.googleapis.com',
    }),
  ],
});
