import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Ensure API key is in environment variables
});

export async function POST(req) {
  try {
    const { emailBody } = await req.json();

    if (!emailBody) {
      return NextResponse.json({ message: 'Email body is missing' }, { status: 400 });
    }

    // Request a summary from OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an assistant that summarizes emails.' },
        { role: 'user', content: `Please summarize this email: ${emailBody}` },
      ],
    });

    const summary = response.choices[0].message.content.trim();

    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    console.error('Error summarizing email:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
