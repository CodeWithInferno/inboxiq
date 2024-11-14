// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';

// // Initialize OpenAI Client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,  // Ensure your OpenAI API key is set in the environment variables
// });

// export async function POST(req) {
//   try {
//     const { emailContent } = await req.json();  // emailContent, not emailBody

//     if (!emailContent) {
//       return NextResponse.json({ message: 'Email body content is missing' }, { status: 400 });
//     }

//     // Call the OpenAI API to generate smart replies based on the email content
//     const prompt = `Generate three brief, professional reply suggestions for the following email:\n\n${emailContent}`;

//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         { role: 'system', content: 'You are an email assistant who generates brief and professional reply suggestions.' },
//         { role: 'user', content: prompt },
//       ],
//     });

//     const replySuggestions = response.choices[0].message.content.trim().split('\n').filter(reply => reply);

//     return NextResponse.json({ reply: replySuggestions[0] }, { status: 200 });
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
import { getSession } from '@auth0/nextjs-auth0'; // Auth0 example, adjust for your auth

const getOpenAIClient = (isFeatureEnabled) => {
  const apiKey = isFeatureEnabled ? process.env.OPENAI_API_KEY : process.env.DISABLED_API;
  return new OpenAI({ apiKey });
};

function extractPlainText(html) {
  const doc = parseDocument(html);
  const textContent = DomUtils.getText(doc);
  return textContent.replace(/\s+/g, ' ').trim();
}

export async function POST(req) {
  try {
    const body = await req.json();
    let { emailContent, userId } = body;

    // If userId is missing, try to retrieve it from the session
    if (!userId) {
      const session = await getSession(req); // Replace this if not using Auth0
      userId = session?.user?.sub || null;
      console.log('Retrieved userId from session:', userId);
    }

    console.log('Received request body:', body);
    console.log('Email Content:', emailContent);
    console.log('User ID:', userId);

    if (!emailContent || !userId) {
      console.error('Email content or user ID is missing');
      return NextResponse.json({ message: 'Email content or user ID is missing' }, { status: 400 });
    }

    const isFeatureEnabled = await getUserFeatureState(userId, 'smartReply');
    console.log("Smart Reply feature status for user:", isFeatureEnabled ? "enabled" : "disabled");

    const openai = getOpenAIClient(isFeatureEnabled);

    if (!isFeatureEnabled) {
      return NextResponse.json({ message: 'Smart reply feature is disabled for this user' }, { status: 403 });
    }

    const plainTextContent = extractPlainText(emailContent);
    console.log('Plain Text Email Content:', plainTextContent);

    const prompt = `
    Generate three brief, professional reply suggestions for the following email content. Each reply should be formatted with double line breaks between sections for readability:
  
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
      { role: 'system', content: 'You are an email assistant who generates brief, professional reply suggestions with double line breaks for readability.' },
      { role: 'user', content: prompt },
    ],
  });
  
  const replySuggestions = response.choices[0].message.content
    .trim()
    .split('\n\n') // Adjust this line to split by double line breaks
    .map(line => line.trim())
    .filter(line => line !== '');
  
  const formattedReply = replySuggestions.join('\n\n'); // Join each suggestion with a double line break
  
  return NextResponse.json({ reply: formattedReply }, { status: 200 });
  
  } catch (error) {
    console.error('Error generating smart replies:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
