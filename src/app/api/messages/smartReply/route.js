// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,  // Make sure your API key is correct
// });

// export async function POST(req) {
//   try {
//     const { emailContent } = await req.json();

//     if (!emailContent) {
//       return new Response(
//         JSON.stringify({ message: 'Email content is required for generating a reply' }),
//         { status: 400, headers: { 'Content-Type': 'application/json' } }
//       );
//     }

//     const prompt = `
//       The following is the content of an email:
//       ---
//       ${emailContent}
//       ---
//       Based on the above content, generate a polite and concise reply.
//     `;

//     // Use the chat completions API to generate a smart reply
//     const aiResponse = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',  // Use gpt-3.5-turbo-turbo or gpt-3.5-turbo depending on your API key
//       messages: [
//         {
//           role: 'system',
//           content: 'You are a helpful assistant that generates email replies.',
//         },
//         {
//           role: 'user',
//           content: prompt,
//         },
//       ],
//       max_tokens: 100,
//       temperature: 0.7,
//     });

//     const smartReply = aiResponse.choices[0].message.content.trim();

//     return new Response(
//       JSON.stringify({ reply: smartReply }),
//       { status: 200, headers: { 'Content-Type': 'application/json' } }
//     );
//   } catch (error) {
//     console.error('Error generating smart reply:', error);

//     if (error.code === 'insufficient_quota') {
//       return new Response(
//         JSON.stringify({ message: 'You have exceeded your API quota. Please upgrade your plan or check your usage.' }),
//         { status: 429, headers: { 'Content-Type': 'application/json' } }
//       );
//     }

//     return new Response(
//       JSON.stringify({ message: 'Internal server error', details: error.message }),
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     );
//   }
// }





// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';
// import { parseDocument } from 'htmlparser2';
// import { DomUtils } from 'htmlparser2';
// import { getUserFeatureState } from '@/lib/getUserFeatureState';

// // Selects either the real or a dummy API key based on feature status
// const getOpenAIClient = (isFeatureEnabled) => {
//   const apiKey = isFeatureEnabled ? process.env.OPENAI_API_KEY : process.env.DISABLED_API;
//   return new OpenAI({ apiKey });
// };

// // Function to parse HTML and get only visible text
// function extractPlainText(html) {
//   const doc = parseDocument(html);
//   const textContent = DomUtils.getText(doc);
//   return textContent.replace(/\s+/g, ' ').trim();
// }

// export async function POST(req) {
//   try {
//     const { emailContent, userId } = await req.json();

//     if (!emailContent || !userId) {
//       console.error('Email content or user ID is missing');
//       return NextResponse.json({ message: 'Email content or user ID is missing' }, { status: 400 });
//     }

//     // Check if the "smartReply" feature is enabled for the user
//     const isFeatureEnabled = await getUserFeatureState(userId, 'smartReply');
//     console.log("Smart Reply feature status:", isFeatureEnabled ? "enabled" : "disabled");

//     // Initialize OpenAI client with either the real or dummy API key
//     const openai = getOpenAIClient(isFeatureEnabled);

//     if (!isFeatureEnabled) {
//       return NextResponse.json({ message: 'Smart reply feature is disabled for this user' }, { status: 403 });
//     }

//     // Clean the email content to plain text only
//     const plainTextContent = extractPlainText(emailContent);
//     console.log('Plain Text Email Content:', plainTextContent);

//     const prompt = `
//       Generate three brief, professional reply suggestions for the following email content. Each reply should be formatted with line breaks after each greeting, main content, and closing:

//       Dear [Sender],
//       [Main content]
//       Best regards,
//       [Your Name]

//       Email:
//       "${plainTextContent}"
//     `;

//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         { role: 'system', content: 'You are an email assistant who generates brief, professional reply suggestions with clear line breaks for readability.' },
//         { role: 'user', content: prompt },
//       ],
//     });

//     const replySuggestions = response.choices[0].message.content
//       .trim()
//       .split('\n')
//       .map(line => line.trim())
//       .filter(line => line !== '');

//     const formattedReply = replySuggestions.join('\n');

//     return NextResponse.json({ reply: formattedReply }, { status: 200 });
//   } catch (error) {
//     console.error('Error generating smart replies:', error);
//     return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
//   }
// }























import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { parseDocument } from 'htmlparser2';
import { DomUtils } from 'htmlparser2';
import { getUserFeatureState } from '@/lib/getUserFeatureState';
import sanitizeEmailContent from '@/utils/sanitizeEmailContent'; // Import sanitization utility

// Selects either the real or a dummy API key based on feature status
const getOpenAIClient = (isFeatureEnabled) => {
  const apiKey = isFeatureEnabled ? process.env.OPENAI_API_KEY : process.env.DISABLED_API;
  return new OpenAI({ apiKey });
};

// Function to parse HTML and get only visible text
function extractPlainText(html) {
  const doc = parseDocument(html);
  const textContent = DomUtils.getText(doc);
  return textContent.replace(/\s+/g, ' ').trim();
}

export async function POST(req) {
  try {
    const { emailContent, userId } = await req.json();

    if (!emailContent || !userId) {
      console.error('Email content or user ID is missing');
      return NextResponse.json({ message: 'Email content or user ID is missing' }, { status: 400 });
    }

    // Check if the "smartReply" feature is enabled for the user
    const isFeatureEnabled = await getUserFeatureState(userId, 'smartReply');
    console.log("Smart Reply feature status:", isFeatureEnabled ? "enabled" : "disabled");

    // Initialize OpenAI client with either the real or dummy API key
    const openai = getOpenAIClient(isFeatureEnabled);

    if (!isFeatureEnabled) {
      return NextResponse.json({ message: 'Smart reply feature is disabled for this user' }, { status: 403 });
    }

    // Clean the email content to plain text only and sanitize it
    const plainTextContent = sanitizeEmailContent(extractPlainText(emailContent));
    console.log('Sanitized Plain Text Email Content:', plainTextContent);

    const prompt = `
      Generate three brief, professional reply suggestions for the following email content. Each reply should be formatted with line breaks after each greeting, main content, and closing:

      Dear [Sender],
      [Main content]
      Best regards,
      [Your Name]

      Email:
      "${plainTextContent}"
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an email assistant who generates brief, professional reply suggestions with clear line breaks for readability.' },
        { role: 'user', content: prompt },
      ],
    });

    // Process and format the reply suggestions
    const replySuggestions = response.choices[0].message.content
      .trim()
      .split('\n\n') // Split suggestions based on double line breaks
      .map(reply => reply.trim())
      .filter(reply => reply !== '');

    return NextResponse.json({ replies: replySuggestions }, { status: 200 });
  } catch (error) {
    console.error('Error generating smart replies:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
