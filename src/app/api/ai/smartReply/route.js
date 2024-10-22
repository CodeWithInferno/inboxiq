import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Ensure your OpenAI API key is set in the environment variables
});

export async function POST(req) {
  try {
    const { emailContent } = await req.json();  // emailContent, not emailBody

    if (!emailContent) {
      return NextResponse.json({ message: 'Email body content is missing' }, { status: 400 });
    }

    // Call the OpenAI API to generate smart replies based on the email content
    const prompt = `Generate three brief, professional reply suggestions for the following email:\n\n${emailContent}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an email assistant who generates brief and professional reply suggestions.' },
        { role: 'user', content: prompt },
      ],
    });

    const replySuggestions = response.choices[0].message.content.trim().split('\n').filter(reply => reply);

    return NextResponse.json({ reply: replySuggestions[0] }, { status: 200 });
  } catch (error) {
    console.error('Error generating smart replies:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
