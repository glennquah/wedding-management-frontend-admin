import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });

    return NextResponse.json({
      result: completion.choices[0].message?.content || '',
    });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return NextResponse.json(
      { error: 'Failed to get a response from OpenAI.' },
      { status: 500 }
    );
  }
}
