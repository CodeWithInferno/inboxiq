import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Make sure your API key is correct
});

export async function POST(req) {
  try {
    const { emailContent } = await req.json();

    if (!emailContent) {
      return new Response(
        JSON.stringify({ message: 'Email content is required for generating a reply' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `
      The following is the content of an email:
      ---
      ${emailContent}
      ---
      Based on the above content, generate a polite and concise reply.
    `;

    // Use the chat completions API to generate a smart reply
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',  // Use gpt-3.5-turbo or gpt-4 depending on your API key
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates email replies.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    const smartReply = aiResponse.choices[0].message.content.trim();

    return new Response(
      JSON.stringify({ reply: smartReply }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating smart reply:', error);

    if (error.code === 'insufficient_quota') {
      return new Response(
        JSON.stringify({ message: 'You have exceeded your API quota. Please upgrade your plan or check your usage.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
