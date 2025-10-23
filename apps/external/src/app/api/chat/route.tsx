import { openai } from '@ai-sdk/openai';
import { UIMessage, generateObject, streamText } from 'ai';
import { z } from 'zod';
import { WeddingResponseDto } from '@shared/api';
import { NextResponse } from 'next/server';

// ----------------------------------------------------
// 1. Define Schemas and Types
// ----------------------------------------------------

const CategoryEnum = z.enum([
  'Getting Started',
  'Initial Planning',
  'Creating the Foundation',
  'Detailed Planning',
  'During the Wedding',
  'After the Wedding',
  'Additional Details',
]);

const ChecklistItemSchema = z.object({
  id: z.string().describe("Unique identifier for NEW item, e.g., 'task-123'"),
  title: z.string().describe('Concise title for the new checklist item'),
  description: z.string().describe('Detailed description of the new task'),
  category: CategoryEnum.describe('Must be one of the seven defined categories'),
  monthsBeforeWedding: z
    .number()
    .int()
    .min(-36)
    .max(36)
    .describe('Integer timeline: months before (positive) or after (negative) the wedding'),
  completed: z.boolean().optional().default(false).describe('Should always be false for new items'),
});

type ChecklistItem = z.infer<typeof ChecklistItemSchema>;

const ChecklistResponseSchema = z.object({
  message: z.string().describe('A helpful message explaining what NEW items were added.'),
  checklist: z
    .array(ChecklistItemSchema)
    .min(0)
    .max(20)
    .describe('An array of NEW checklist items to be added.'),
});

// REMOVED: interface ChecklistResponse - Rely on z.infer for the type definition
type ChecklistResponse = z.infer<typeof ChecklistResponseSchema>;

// ----------------------------------------------------
// Rest of the helper functions and POST handler
// ----------------------------------------------------

/** Helper to render message history */
function buildHistory(msgs: UIMessage[] = []) {
  return msgs
    .map((m: UIMessage) => {
      // Extract text content from message parts
      const textParts = m.parts?.filter((part) => part.type === 'text') ?? [];
      const content = textParts.map((part) => ('text' in part ? part.text : '')).join(' ');
      return `${m?.role === 'user' ? 'User' : 'Assistant'}: ${content || ''}`;
    })
    .join('\n');
}

/** Small retry helper */
async function withRetry<T>(fn: () => Promise<T>, retries = 1): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (retries <= 0) throw e;
    // Simple wait between retries
    await new Promise((resolve) => setTimeout(resolve, 500));
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
    wedding?: WeddingResponseDto;
  } = await req.json();

  const history = buildHistory(messages);

  if (action === 'checklist') {
    try {
      // Get the user's latest message
      // Using generic object structure for messages for safer access
      const msgsAny = (messages as unknown as Array<{ role?: string; content?: unknown }>) || [];
      const lastUser = [...msgsAny].reverse().find((m) => m?.role === 'user');
      const content = lastUser?.content as unknown;
      const userText = typeof content === 'string' ? content : JSON.stringify(content ?? '');

      // FINAL FIX: Removed generic parameter from generateObject.
      // The type of 'object' is now correctly inferred from the 'schema' property.
      const { object } = await withRetry(
        () =>
          generateObject({
            model: openai('gpt-4o'),
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
              '  "message": "string - Your helpful explanation of what NEW items were added",\n' +
              '  "checklist": [\n' +
              '    {\n' +
              '      "id": "string - Unique identifier for NEW item",\n' +
              '      "title": "string - NEW item title",\n' +
              '      "description": "string - Detailed description of NEW item",\n' +
              '      "category": "string - Must be one of the 7 categories listed above",\n' +
              '      "monthsBeforeWedding": number - Integer between -36 to 36 months,\n' +
              '      "completed": false\n' +
              '    }\n' +
              '  ]\n' +
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

      // Cast 'object' to the inferred type 'ChecklistResponse' for cleaner usage
      const responseObject = object as ChecklistResponse;

      console.log('Checklist API success:', {
        messageLength: responseObject.message?.length,
        checklistLength: responseObject.checklist?.length,
        firstItem: responseObject.checklist?.[0],
      });

      return new Response(
        JSON.stringify({
          message: responseObject.message,
          checklist: responseObject.checklist,
        }),
        {
          headers: { 'content-type': 'application/json' },
        },
      );
    } catch (err) {
      console.error('Checklist API error:', err);

      // Log more details about the error
      if (err && typeof err === 'object') {
        const error = err as { name?: string; message?: string; stack?: string; cause?: unknown };
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
          cause: error.cause,
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

  // ... (The 'assistant' action block remains the same)
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
