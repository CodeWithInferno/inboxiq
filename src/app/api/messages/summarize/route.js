// /src/app/api/messages/summarize/route.js
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API Key is in the environment variables
});

export async function POST(req) {
  try {
    const { emailBody } = await req.json();

    if (!emailBody) {
      return new Response(JSON.stringify({ message: 'Email body is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Use OpenAI's GPT to summarize the email
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an email summarizer.' },
        { role: 'user', content: `Summarize this email: ${emailBody}` },
      ],
      max_tokens: 150,  // Adjust based on how concise the summary needs to be
    });

    const summary = response.choices[0].message.content.trim();

    return new Response(JSON.stringify({ summary }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error summarizing email:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
