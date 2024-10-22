import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { templateType, userEmail } = await req.json();

    if (!templateType) {
      return NextResponse.json({ message: 'Template description is missing' }, { status: 400 });
    }

    const emailPrompt = `
      You are an email assistant. Generate a professional email for the following scenario: ${templateType}.
      Ensure the email has a subject and a well-structured body with proper paragraph breaks.
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an email assistant.' },
        { role: 'user', content: emailPrompt },
      ],
    });

    const result = response.choices[0].message.content.trim().split('\n');
    const subject = result[0].replace('Subject:', '').trim();
    const body = result.slice(1).join('\n').replace(/\n\n/g, '<br><br>').trim();

    return NextResponse.json({ subject, body }, { status: 200 });
  } catch (error) {
    console.error('Error generating template:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
