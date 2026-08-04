'use server';
/**
 * @fileOverview An AI flow for enhancing text content within the resume builder.
 *
 * - enhanceText - A function that takes existing text and its context (e.g., "summary") and suggests improvements.
 * - EnhanceTextInput - The input type for the enhanceText function.
 * - EnhanceTextOutput - The return type for the enhanceText function.
 */

import {assertGeminiApiKey, getGenkitAI} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const EnhanceTextInputSchema = z.object({
  text: z.string().describe('The text to be enhanced.'),
  context: z
    .string()
    .describe(
      'The context of the text (e.g., "resume summary", "job description").'
    ),
  focusContext: z.string().optional().default('').describe('User-provided instructions to steer the suggestions (e.g., "emphasize leadership").'),
  jobDescription: z.string().optional().default('').describe('A target job posting text or a URL to one, used to tailor suggestions.'),
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

// Improve resume summary flow inspired by resume-lm: produce a polished
// rewritten summary and a short list of bullet improvements / keywords.
const ImproveSummaryInputSchema = z.object({
  text: z.string().describe('The resume summary text to improve.'),
  role: z.string().optional().describe('Optional target role or industry.'),
  focusContext: z.string().optional().default('').describe('User-provided instructions to steer the suggestions.'),
  jobDescription: z.string().optional().default('').describe('A target job posting text or a URL to one, used to tailor suggestions.'),
});
export type ImproveSummaryInput = z.infer<typeof ImproveSummaryInputSchema>;

const ImproveSummaryOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array where the first item is a rewritten summary and following items are bullets with suggestions/keywords.'),
});
export type ImproveSummaryOutput = z.infer<typeof ImproveSummaryOutputSchema>;

// --- Per-position experience description generation ---
const EnhanceExperienceInputSchema = z.object({
  jobTitle: z.string().optional().default('').describe('The job title of the position.'),
  company: z.string().optional().default('').describe('The company or employer name.'),
  city: z.string().optional().default('').describe('The city or location of the position.'),
  text: z.string().optional().default('').describe('The current job description text (may be empty).'),
  focusContext: z.string().optional().default('').describe('User-provided instructions to steer the suggestions (e.g., "highlight Python and cloud migration").'),
  jobDescription: z.string().optional().default('').describe('A target job posting text or a URL to one, used to tailor suggestions.'),
  excludedSuggestions: z
    .array(z.string())
    .optional()
    .default([])
    .describe('Suggestions already shown to the user that the model must not repeat (complementary generation).'),
});
export type EnhanceExperienceInput = z.infer<typeof EnhanceExperienceInputSchema>;

const EnhanceExperienceOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of 4 role-specific, ready-to-paste task/responsibility descriptions for the given job position.'),
});
export type EnhanceExperienceOutput = z.infer<typeof EnhanceExperienceOutputSchema>;

const CombineExperienceInputSchema = z.object({
  jobTitle: z.string().optional().default('').describe('The job title of the position.'),
  company: z.string().optional().default('').describe('The company or employer name.'),
  focusContext: z.string().optional().default('').describe('User-provided instructions to steer the combined text.'),
  jobDescription: z.string().optional().default('').describe('A target job posting text or a URL to one, used to tailor the combined text.'),
  suggestions: z
    .array(z.string())
    .describe('The user-selected suggestion bullets to synthesize into one cohesive job description block.'),
});
export type CombineExperienceInput = z.infer<typeof CombineExperienceInputSchema>;

const CombineExperienceOutputSchema = z.object({
  text: z.string().describe('A single cohesive, ATS-friendly job description block synthesized from the given suggestions.'),
});
export type CombineExperienceOutput = z.infer<typeof CombineExperienceOutputSchema>;

const MAX_JOB_DESCRIPTION_LENGTH = 12000;

// If the user pasted a URL, fetch it server-side and extract readable text.
// If the fetch fails or the input is plain text, fall back to the raw value so
// the prompt always receives something usable.
async function resolveJobDescriptionText(jobDescription: string): Promise<string> {
  if (!jobDescription) return '';
  const trimmed = jobDescription.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return trimmed.slice(0, MAX_JOB_DESCRIPTION_LENGTH);
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(trimmed, {
      signal: controller.signal,
      headers: {'user-agent': 'Mozilla/5.0 (compatible; CvWizard/1.0)'},
    });
    clearTimeout(timeout);
    if (!response.ok) return trimmed;
    const html = await response.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/\s+/g, ' ')
      .trim();
    return text.slice(0, MAX_JOB_DESCRIPTION_LENGTH);
  } catch (error) {
    console.warn('Failed to fetch job description URL, using raw input:', error);
    return trimmed.slice(0, MAX_JOB_DESCRIPTION_LENGTH);
  }
}

function buildFlows() {
  const ai = getGenkitAI();

  const summaryPrompt = ai.definePrompt({
    name: 'improveSummaryPrompt',
    model: googleAI.model('gemini-2.5-flash'),
    input: {schema: ImproveSummaryInputSchema},
    output: {schema: ImproveSummaryOutputSchema},
    prompt: `You are a senior resume writer and career coach. The user provided the following resume summary:
'''
{{{text}}}
'''

If a target role or industry is provided, tailor the rewrite to that role: "{{{role}}}".

USER FOCUS INSTRUCTIONS (heavily weighted — follow these above all else; empty if none):
{{{focusContext}}}

TARGET JOB POSTING (tailor wording and keywords to this posting; empty if none):
{{{jobDescription}}}

Provide a single polished, concise rewritten summary (1-2 sentences) optimized for recruiters and ATS as the first output item. Then provide 3 short bullet suggestions (each 8-12 words) for improvements, keywords, or alternate phrasings.

Focus on clarity, strong action verbs, measurable impact, and relevant keywords. Reflect the user focus instructions and the target job posting's required skills and language in the summary and suggestions. Return exactly one rewritten summary followed by three bullets as separate items in the output array.
`,
  });

  const improveSummaryFlow = ai.defineFlow(
    {
      name: 'improveSummaryFlow',
      inputSchema: ImproveSummaryInputSchema,
      outputSchema: ImproveSummaryOutputSchema,
    },
    async input => {
      const resolved = await resolveJobDescriptionText(input.jobDescription);
      const {output} = await summaryPrompt({...input, jobDescription: resolved});
      return output!;
    }
  );

  const prompt = ai.definePrompt({
    name: 'textEnhancerPrompt',
    // use the model helper exported by the google-genai package so the value
    // matches Genkit's expected ModelArgument type
    model: googleAI.model('gemini-2.5-flash'),
    input: {schema: EnhanceTextInputSchema},
    output: {schema: EnhanceTextOutputSchema},
    prompt: `You are an expert resume writing assistant. Your task is to provide suggestions to improve a piece of text from a user's resume.
The user has provided the following text:
'''
{{{text}}}
'''

This text is for the "{{{context}}}" section of their resume.

USER FOCUS INSTRUCTIONS (heavily weighted — follow these above all else; empty if none):
{{{focusContext}}}

TARGET JOB POSTING (tailor wording and keywords to this posting; empty if none):
{{{jobDescription}}}

Please analyze the text and provide 3 to 5 clear, concise, and actionable suggestions for improvement.
Focus on correcting spelling and grammar, improving clarity, strengthening action verbs, and making the content more impactful.
Each suggestion should be a complete thought. If suggesting a rewrite, provide the full rewritten sentence.
Reflect the user focus instructions and the target job posting's required skills and language in every suggestion.

Return your suggestions in the required output format.`,
  });

  const enhanceTextFlow = ai.defineFlow(
    {
      name: 'enhanceTextFlow',
      inputSchema: EnhanceTextInputSchema,
      outputSchema: EnhanceTextOutputSchema,
    },
    async input => {
      const resolved = await resolveJobDescriptionText(input.jobDescription);
      const {output} = await prompt({...input, jobDescription: resolved});
      return output!;
    }
  );

  const experiencePrompt = ai.definePrompt({
    name: 'enhanceExperiencePrompt',
    model: googleAI.model('gemini-2.5-flash'),
    input: {schema: EnhanceExperienceInputSchema},
    output: {schema: EnhanceExperienceOutputSchema},
    prompt: `You are a senior resume writer and career coach who writes realistic, human-sounding job descriptions for applicants tracking systems (ATS).

POSITION CONTEXT:
- Job Title: {{{jobTitle}}}
- Company: {{{company}}}
- Location: {{{city}}}
- Existing description: """{{{text}}}"""
- Suggestions already shown to the user (DO NOT repeat these): {{{excludedSuggestions}}}

USER FOCUS INSTRUCTIONS (heavily weighted — every bullet must reflect these; empty if none):
{{{focusContext}}}

TARGET JOB POSTING (tailor every suggestion to this posting's required skills, keywords, and phrasing; empty if none):
{{{jobDescription}}}

TASK: Write exactly 4 distinct, ready-to-paste responsibility descriptions for THIS specific position. Each one must:
- Open with a strong action verb (shipped, built, cut, led, launched, automated, owned, negotiated, redesigned, grew, restructured, resolved) and read like real work, not a template.
- Be specific to the job title, company, and industry.
- Include a concrete outcome, metric, or measurable impact where realistic.
- Vary in sentence structure and length so the group sounds written by a human.
- Directly address the user focus instructions and mirror the skills and language used in the target job posting. Heavily weight this guidance over generic phrasing.

HARD RULES (ZERO AI FINGERPRINT):
- Never use these or similar corporate filler words: delve, delve into, seamlessly, testament, leveraging, leverage, utilize, synergy, synergize, cutting-edge, robust, streamline, dynamic, passionate, world-class, best-in-class, state-of-the-art, empower, facilitate, foster, foster innovation, comprehensive, ultimately, furthermore, moreover, in order to.
- Never announce or explain the text ("Here are suggestions", "Consider adding", "This bullet shows").
- Never use first-person "I" or "my". Do not start with "Responsible for", "Duties include", or "Tasked with".
- No ATS-hostile content: plain text only, no images, icons, tables, or special formatting.

Return exactly 4 items in the required output format.`,
  });

  const enhanceExperienceFlow = ai.defineFlow(
    {
      name: 'enhanceExperienceFlow',
      inputSchema: EnhanceExperienceInputSchema,
      outputSchema: EnhanceExperienceOutputSchema,
    },
    async input => {
      const resolved = await resolveJobDescriptionText(input.jobDescription);
      const {output} = await experiencePrompt({...input, jobDescription: resolved});
      return output!;
    }
  );

  const combinePrompt = ai.definePrompt({
    name: 'combineExperiencePrompt',
    model: googleAI.model('gemini-2.5-flash'),
    input: {schema: CombineExperienceInputSchema},
    output: {schema: CombineExperienceOutputSchema},
    prompt: `You are a senior resume writer who turns raw bullet points into one cohesive, human-sounding job description that performs well in applicant tracking systems (ATS).

POSITION: {{{jobTitle}}} at {{{company}}}
USER-SELECTED BULLETS TO SYNTHESIZE:
{{{suggestions}}}

USER FOCUS INSTRUCTIONS (heavily weighted — reflect these in the combined text; empty if none):
{{{focusContext}}}

TARGET JOB POSTING (tailor the combined text to this posting's required skills and keywords; empty if none):
{{{jobDescription}}}

TASK: Synthesize the selected bullets into a single, cohesive job description block for the role. Follow this strict format:
1. A 1-sentence role overview that summarizes the scope.
2. 3-5 refined bullets, each opening with a strong action verb and keeping the specific outcomes from the source bullets.
Merge overlapping ideas, remove repetition, and smooth the flow so the whole block reads as one human-written description. Heavily weight the user focus instructions and the target job posting's language and required skills.

HARD RULES (ZERO AI FINGERPRINT):
- Never use filler/corporate words: delve, seamlessly, testament, leveraging, utilize, synergy, cutting-edge, robust, streamline, dynamic, passionate, world-class, best-in-class, state-of-the-art, empower, facilitate, foster, foster growth, comprehensive, ultimately.
- No self-reference ("Here is", "This description", "I combined").
- First-person pronouns are allowed ONLY in the overview sentence ("I led...") — keep bullets verb-first without a subject where natural.
- ATS-safe: plain text, standard phrases, no icons, tables, or decorative formatting.

Return only the final joined text in the required output format.`,
  });

  const combineExperienceFlow = ai.defineFlow(
    {
      name: 'combineExperienceFlow',
      inputSchema: CombineExperienceInputSchema,
      outputSchema: CombineExperienceOutputSchema,
    },
    async input => {
      const resolved = await resolveJobDescriptionText(input.jobDescription);
      const {output} = await combinePrompt({...input, jobDescription: resolved});
      return output!;
    }
  );

  return {
    improveSummaryFlow,
    enhanceTextFlow,
    enhanceExperienceFlow,
    combineExperienceFlow,
  };
}

let flows: ReturnType<typeof buildFlows> | undefined;

function getFlows(): ReturnType<typeof buildFlows> {
  if (!flows) {
    flows = buildFlows();
  }
  return flows;
}

// Logs EVERYTHING about a failed AI call to the server logs (Vercel function
// logs), including Genkit-specific fields, so the real message is never hidden
// behind Next.js's production digest.
function logDetailedAiError(operation: string, error: unknown): void {
  const details: Record<string, unknown> = {
    operation,
    name: error instanceof Error ? error.name : typeof error,
    message: error instanceof Error ? error.message : error,
  };
  if (error instanceof Error) {
    details.stack = error.stack;
    // Genkit errors carry extra fields (status, source, detail, cause).
    for (const key of ['status', 'source', 'detail', 'cause']) {
      const value = (error as unknown as Record<string, unknown>)[key];
      if (value !== undefined) details[key] = value;
    }
  }
  console.error('Detailed AI Error:', JSON.stringify(details, null, 2));
  console.error('Raw AI error:', error);
}

// NOTE on the model: 'gemini-2.5-flash' is the valid, registered model name
// for @genkit-ai/google-genai@1.20.0 (see its KNOWN_GEMINI_MODELS). The older
// 'gemini-1.5-flash' is NOT registered in this version and would throw
// "invalid model". Verified against the installed plugin registry.
export async function enhanceText(
  input: EnhanceTextInput
): Promise<EnhanceTextOutput> {
  assertGeminiApiKey();
  try {
    const {enhanceTextFlow} = getFlows();
    return await enhanceTextFlow(input);
  } catch (error) {
    logDetailedAiError('text enhancement', error);
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Unknown error from the AI provider.';
    throw new Error(`AI_TEXT_ENHANCEMENT_ERROR: ${message}`);
  }
}

export async function improveSummary(
  input: ImproveSummaryInput
): Promise<ImproveSummaryOutput> {
  assertGeminiApiKey();
  try {
    const {improveSummaryFlow} = getFlows();
    return await improveSummaryFlow(input);
  } catch (error) {
    logDetailedAiError('summary improvement', error);
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Unknown error from the AI provider.';
    throw new Error(`AI_SUMMARY_IMPROVEMENT_ERROR: ${message}`);
  }
}

export async function enhanceExperienceDescription(
  input: EnhanceExperienceInput
): Promise<EnhanceExperienceOutput> {
  assertGeminiApiKey();
  try {
    const {enhanceExperienceFlow} = getFlows();
    return await enhanceExperienceFlow(input);
  } catch (error) {
    logDetailedAiError('experience description generation', error);
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Unknown error from the AI provider.';
    throw new Error(`AI_EXPERIENCE_DESCRIPTION_ERROR: ${message}`);
  }
}

export async function combineExperienceSuggestions(
  input: CombineExperienceInput
): Promise<CombineExperienceOutput> {
  assertGeminiApiKey();
  try {
    const {combineExperienceFlow} = getFlows();
    return await combineExperienceFlow(input);
  } catch (error) {
    logDetailedAiError('experience suggestion combine', error);
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Unknown error from the AI provider.';
    throw new Error(`AI_EXPERIENCE_COMBINE_ERROR: ${message}`);
  }
}