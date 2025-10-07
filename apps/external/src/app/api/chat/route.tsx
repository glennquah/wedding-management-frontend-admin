import { openai } from '@ai-sdk/openai';
import { UIMessage, generateObject, streamText } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export const ChecklistItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  monthsBeforeWedding: z.number().int().min(0).max(36),
  completed: z.boolean().optional(),
});
export type ChecklistItem = z.infer<typeof ChecklistItemSchema>;

export const ChecklistResponseSchema = z.object({
  message: z.string(),
  checklist: z.array(ChecklistItemSchema).min(1).max(50),
});
export type ChecklistResponse = z.infer<typeof ChecklistResponseSchema>;

/** Helper to render message history */
function buildHistory(msgs: UIMessage[] = []) {
  return msgs
    .map(
      (m: any) =>
        `${m?.role === 'user' ? 'User' : 'Assistant'}: ${
          typeof m?.content === 'string' ? m?.content : JSON.stringify(m?.content ?? '')
        }`,
    )
    .join('\n');
}

/** Small retry helper */
async function withRetry<T>(fn: () => Promise<T>, retries = 1): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (retries <= 0) throw e;
    return withRetry(fn, retries - 1);
  }
}

/** The POST handler */
export async function POST(req: Request) {
  const {
    messages,
    checklist,
    action,
    wedding,
  }: {
    messages: UIMessage[];
    checklist?: ChecklistItem[];
    action: 'checklist' | 'assistant';
    wedding?: any;
  } = await req.json();

  const history = buildHistory(messages);

  if (action === 'checklist') {
    try {
      const { object } = await withRetry(
        () =>
          generateObject<ChecklistResponse>({
            model: openai('gpt-4o'),
            temperature: 0.2,
            system:
              'You are a professional wedding planning assistant for Knotly. You help couples customize their wedding planning checklist by adding relevant items based on their specific needs, preferences, and requirements.',
            prompt:
              `Conversation History:\n${history}\n\n` +
              `Here is the current wedding planning checklist with ${checklist?.length || 0} items:\n${JSON.stringify(checklist, null, 2)}\n\n` +
              `Based on the user's input and requirements, please:\n` +
              `1. Keep ALL existing checklist items unchanged\n` +
              `2. Add new relevant checklist items that address the user's specific needs\n` +
              `3. Ensure each new item has a unique ID, title, description, appropriate category, and monthsBeforeWedding value\n` +
              `4. Categories should be one of: "Getting Started", "Initial Planning", "Creating the Foundation", "Detailed Planning", "During the Wedding", "After the Wedding", "Additional Details"\n` +
              `5. monthsBeforeWedding should be a realistic timeline (-36 to 36 months; negative values represent months after the wedding day)\n` +
              `6. Provide a helpful response message explaining what you've added\n\n` +
              `IMPORTANT: You MUST return a JSON object with this EXACT structure:\n` +
              `{\n` +
              `  "message": "string - Your helpful explanation of what was added",\n` +
              `  "checklist": [\n` +
              `    {\n` +
              `      "id": "string - Unique identifier",\n` +
              `      "title": "string - Item title",\n` +
              `      "description": "string - Detailed description",\n` +
              `      "category": "string - Must be one of the 7 categories listed above",\n` +
              `      "monthsBeforeWedding": number - Integer between -36 to 36 months; negative values represent months after the wedding day,\n` +
              `      "completed": false\n` +
              `    }\n` +
              `  ]\n` +
              `}\n\n` +
              `Requirements:\n` +
              `- The checklist array must contain between 1 and 50 items\n` +
              `- Include ALL existing items plus new ones\n` +
              `- Each item's "id" must be a string\n` +
              `- Each item's "monthsBeforeWedding" must be an integer between -36 to 36 months; negative values represent months after the wedding day\n` +
              `- Each item's "completed" should be false for new items\n` +
              `- Do not include any extra fields not specified in the schema\n` +
              `- Do not wrap the response in markdown code blocks\n\n` +
              `Return the complete updated checklist including both existing and new items.`,
            schema: ChecklistResponseSchema,
          }),
        1,
      );

      return new Response(
        JSON.stringify({
          message: object.message,
          checklist: object.checklist,
        }),
        {
          headers: { 'content-type': 'application/json' },
        },
      );
    } catch (err) {
      console.error('Checklist API error:', err);

      return new Response(
        JSON.stringify({
          message: 'I encountered an error while updating your checklist. Please try again.',
          checklist: checklist || [],
        }),
        {
          headers: { 'content-type': 'application/json' },
        },
      );
    }
  }

  if (action === 'assistant') {
    try {
      const msgsAny = (messages as unknown as Array<{ role?: string; content?: unknown }>) || [];
      const lastUser = [...msgsAny].reverse().find((m) => m?.role === 'user');
      const content = lastUser?.content as unknown;
      const userText = typeof content === 'string' ? content : JSON.stringify(content ?? '');

      const result = await streamText({
        model: openai('gpt-4o-mini'),
        temperature: 0.4,
        system:
          'You are a professional wedding planning assistant for Knotly. Your role is to: ' +
          'identify details couples may miss in their current plan, suggest additional relevant checklist items, and provide general help on wedding planning and coordination. ' +
          'Keep responses concise, friendly, and actionable. When information is missing, ask a clear follow-up question.',
        prompt:
          `Wedding instance (may be null):\n${JSON.stringify(wedding ?? null, null, 2)}\n\n` +
          `Conversation so far:\n${history}\n\n` +
          `User message:\n${userText}`,
      });

      let fullText = '';
      for await (const part of result.textStream) {
        fullText += part;
      }

      return new Response(JSON.stringify({ message: fullText }), {
        headers: { 'content-type': 'application/json' },
      });
    } catch (err) {
      console.error('Checklist API error:', err);

      return new Response(
        JSON.stringify({
          message: 'I encountered an error while assisting you. Please try again.',
        }),
        {
          headers: { 'content-type': 'application/json' },
        },
      );
    }
  }

  return new Response(JSON.stringify({ message: 'Invalid action provided.' }), {
    headers: { 'content-type': 'application/json' },
  });
}
