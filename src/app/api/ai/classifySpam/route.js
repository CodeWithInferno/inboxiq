import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email content is missing' }, { status: 400 });
    }

    const emailText = `
      Classify the following email as either "Spam" or "Important":
      Subject: ${email.subject}
      Body: ${email.body}
    `;

    // Call OpenAI API (ChatGPT-4)
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an assistant who helps classify emails as either spam or important.' },
        { role: 'user', content: emailText },
      ],
    });

    const classification = response.choices[0].message.content.trim();

    return NextResponse.json({ classification }, { status: 200 });
  } catch (error) {
    console.error('Error classifying email:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
