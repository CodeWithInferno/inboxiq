import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email content is missing' }, { status: 400 });
    }

    // Check if OpenAI should be used based on the environment variable
    if (process.env.USE_OPENAI === 'false') {
      // If not, return a default low priority
      return NextResponse.json({ priority: 'Low Priority (OpenAI Disabled)' }, { status: 200 });
    }

    const emailText = `
      Classify the following email as "High Priority" or "Low Priority":
      Email Content:
      Subject: ${email.subject}
      Body: ${email.body}
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an email assistant who helps classify emails based on priority.' },
        { role: 'user', content: emailText },
      ],
    });

    const classification = response.choices[0].message.content.trim();

    return NextResponse.json({ priority: classification }, { status: 200 });
  } catch (error) {
    console.error('Error classifying email:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
