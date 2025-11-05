'use server';
/**
 * @fileOverview An AI flow for enhancing text content within the resume builder.
 *
 * - enhanceText - A function that takes existing text and its context (e.g., "summary") and suggests improvements.
 * - EnhanceTextInput - The input type for the enhanceText function.
 * - EnhanceTextOutput - The return type for the enhanceText function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const EnhanceTextInputSchema = z.object({
  text: z.string().describe('The text to be enhanced.'),
  context: z
    .string()
    .describe(
      'The context of the text (e.g., "resume summary", "job description").'
    ),
});
export type EnhanceTextInput = z.infer<typeof EnhanceTextInputSchema>;

const EnhanceTextOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe(
      'A list of 3-5 specific, actionable suggestions to improve the text. This can include spelling corrections, rephrasing for clarity, or alternative ideas.'
    ),
});
export type EnhanceTextOutput = z.infer<typeof EnhanceTextOutputSchema>;

export async function enhanceText(
  input: EnhanceTextInput
): Promise<EnhanceTextOutput> {
  return enhanceTextFlow(input);
}

// Improve resume summary flow inspired by resume-lm: produce a polished
// rewritten summary and a short list of bullet improvements / keywords.
const ImproveSummaryInputSchema = z.object({
  text: z.string().describe('The resume summary text to improve.'),
  role: z.string().optional().describe('Optional target role or industry.'),
});
export type ImproveSummaryInput = z.infer<typeof ImproveSummaryInputSchema>;

const ImproveSummaryOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array where the first item is a rewritten summary and following items are bullets with suggestions/keywords.'),
});
export type ImproveSummaryOutput = z.infer<typeof ImproveSummaryOutputSchema>;

const summaryPrompt = ai.definePrompt({
  name: 'improveSummaryPrompt',
  model: googleAI.model('gemini-pro'),
  input: {schema: ImproveSummaryInputSchema},
  output: {schema: ImproveSummaryOutputSchema},
  prompt: `You are a senior resume writer and career coach. The user provided the following resume summary:
'''
{{{text}}}
'''

If a target role or industry is provided, tailor the rewrite to that role: "{{{role}}}".

Provide a single polished, concise rewritten summary (1-2 sentences) optimized for recruiters and ATS as the first output item. Then provide 3 short bullet suggestions (each 8-12 words) for improvements, keywords, or alternate phrasings.

Focus on clarity, strong action verbs, measurable impact, and relevant keywords. Return exactly one rewritten summary followed by three bullets as separate items in the output array.
`,
});

const improveSummaryFlow = ai.defineFlow(
  {
    name: 'improveSummaryFlow',
    inputSchema: ImproveSummaryInputSchema,
    outputSchema: ImproveSummaryOutputSchema,
  },
  async input => {
    const {output} = await summaryPrompt(input);
    return output!;
  }
);

export async function improveSummary(input: ImproveSummaryInput): Promise<ImproveSummaryOutput> {
  return improveSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'textEnhancerPrompt',
  // use the model helper exported by the google-genai package so the value
  // matches Genkit's expected ModelArgument type
  model: googleAI.model('gemini-pro'),
  input: {schema: EnhanceTextInputSchema},
  output: {schema: EnhanceTextOutputSchema},
  prompt: `You are an expert resume writing assistant. Your task is to provide suggestions to improve a piece of text from a user's resume.
The user has provided the following text:
'''
{{{text}}}
'''

This text is for the "{{{context}}}" section of their resume.

Please analyze the text and provide 3 to 5 clear, concise, and actionable suggestions for improvement.
Focus on correcting spelling and grammar, improving clarity, strengthening action verbs, and making the content more impactful.
Each suggestion should be a complete thought. If suggesting a rewrite, provide the full rewritten sentence.

Return your suggestions in the required output format.`,
});

const enhanceTextFlow = ai.defineFlow(
  {
    name: 'enhanceTextFlow',
    inputSchema: EnhanceTextInputSchema,
    outputSchema: EnhanceTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
