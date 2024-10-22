import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set in the environment variables
});

export async function POST(req) {
  try {
    const { emailBody } = await req.json();

    if (!emailBody) {
      return NextResponse.json({ message: 'Email content is missing' }, { status: 400 });
    }

    const prompt = `
      Analyze the sentiment of the following email and classify it as Positive, Neutral, or Negative:
      Email Body:
      "${emailBody}"
    `;

    // Call OpenAI API (ChatGPT-4)
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a sentiment analysis assistant.' },
        { role: 'user', content: prompt },
      ],
    });

    const sentiment = response.choices[0].message.content.trim();

    return NextResponse.json({ sentiment }, { status: 200 });
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
