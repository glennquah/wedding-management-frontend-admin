import { openai } from '@ai-sdk/openai';
import { UIMessage, generateObject, streamText } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export const ChecklistItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  monthsBeforeWedding: z.number().int().min(-36).max(36),
  completed: z.boolean().optional(),
});
export type ChecklistItem = z.infer<typeof ChecklistItemSchema>;

export const ChecklistResponseSchema = z.object({
  message: z.string(),
  checklist: z.array(ChecklistItemSchema).min(0).max(20), // Allow 0-20 new items
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
      // Get the user's latest message
      const msgsAny = (messages as unknown as Array<{ role?: string; content?: unknown }>) || [];
      const lastUser = [...msgsAny].reverse().find((m) => m?.role === 'user');
      const content = lastUser?.content as unknown;
      const userText = typeof content === 'string' ? content : JSON.stringify(content ?? '');

      const { object } = await withRetry(
        () =>
          generateObject({
            model: openai('gpt-4o'),
            schema: ChecklistResponseSchema,
            temperature: 0.2,
            system:
              'You are a professional wedding planning assistant for Knotly. You help couples customize their wedding planning checklist by adding relevant items based on their specific needs, preferences, and requirements.\n\n' +
              'CRITICAL INSTRUCTIONS:\n' +
              "Based on the user's input and requirements, please:\n" +
              '1. ONLY return NEW checklist items that should be ADDED to the existing checklist\n' +
              '2. DO NOT include any existing checklist items in your response\n' +
              "3. ONLY generate items that are relevant to the user's specific request\n" +
              '4. Each new item must have a unique ID, title, description, appropriate category, and monthsBeforeWedding value\n' +
              '5. Categories should be one of: "Getting Started", "Initial Planning", "Creating the Foundation", "Detailed Planning", "During the Wedding", "After the Wedding", "Additional Details"\n' +
              '6. monthsBeforeWedding should be a realistic timeline (-36 to 36 months; negative values represent months after the wedding day)\n' +
              "7. Provide a helpful response message explaining what you've added\n\n" +
              'IMPORTANT: Your response should contain ONLY the NEW items to be added, not the entire checklist!\n\n' +
              'RESPONSE FORMAT:\n' +
              'You MUST return a JSON object with this EXACT structure:\n' +
              '{\n' +
              '  "message": "string - Your helpful explanation of what NEW items were added",\n' +
              '  "checklist": [\n' +
              '    {\n' +
              '      "id": "string - Unique identifier for NEW item",\n' +
              '      "title": "string - NEW item title",\n' +
              '      "description": "string - Detailed description of NEW item",\n' +
              '      "category": "string - Must be one of the 7 categories listed above",\n' +
              '      "monthsBeforeWedding": number - Integer between -36 to 36 months,\n' +
              '      "completed": false\n' +
              '    }\n' +
              '  ]\n' +
              '}\n\n' +
              'REQUIREMENTS:\n' +
              '- Return ONLY NEW items (1-20 items maximum per request)\n' +
              '- Each item\'s "id" must be a string\n' +
              '- Each item\'s "monthsBeforeWedding" must be an integer between -36 to 36\n' +
              '- Each item\'s "completed" should be false for new items\n' +
              '- Do not include any extra fields not specified in the schema\n' +
              '- Do not wrap the response in markdown code blocks\n\n' +
              `EXISTING CHECKLIST (${checklist?.length || 0} items - DO NOT INCLUDE THESE):\n${JSON.stringify(checklist, null, 2)}`,
            prompt: `User's request: ${userText}`,
            schema: ChecklistResponseSchema,
          }),
        1,
      );

      console.log('Checklist API success:', {
        messageLength: object.message?.length,
        checklistLength: object.checklist?.length,
        firstItem: object.checklist?.[0],
      });

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

      // Log more details about the error
      if (err && typeof err === 'object') {
        console.error('Error details:', {
          name: (err as any).name,
          message: (err as any).message,
          stack: (err as any).stack,
          cause: (err as any).cause,
        });
      }

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
          'Keep responses concise, friendly, and actionable. When information is missing, ask a clear follow-up question.\n\n' +
          `WEDDING INSTANCE:\n${JSON.stringify(wedding ?? null, null, 2)}\n\n` +
          `CONVERSATION HISTORY:\n${history}\n\n` +
          `CURRENT CHECKLIST (${checklist?.length || 0} items):\n${JSON.stringify(checklist ?? [], null, 2)}`,
        prompt: `User message:\n${userText}`,
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
