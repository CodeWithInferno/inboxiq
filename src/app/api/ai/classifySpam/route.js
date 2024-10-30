// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';

// // Initialize OpenAI Client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req) {
//   try {
//     const { email } = await req.json();

//     if (!email) {
//       return NextResponse.json({ message: 'Email content is missing' }, { status: 400 });
//     }

//     const emailText = `
//       Classify the following email as either "Spam" or "Important":
//       Subject: ${email.subject}
//       Body: ${email.body}
//     `;

//     // Call OpenAI API (Chatgpt-3.5-turbo)
//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         { role: 'system', content: 'You are an assistant who helps classify emails as either spam or important.' },
//         { role: 'user', content: emailText },
//       ],
//     });

//     const classification = response.choices[0].message.content.trim();

//     return NextResponse.json({ classification }, { status: 200 });
//   } catch (error) {
//     console.error('Error classifying email:', error);
//     return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
//   }
// }










import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getSession } from '@auth0/nextjs-auth0';
import { getUserFeatureState } from '@/lib/getUserFeatureState';

// Function to initialize OpenAI client with appropriate API key based on feature status
function getOpenAIClient(isFeatureEnabled) {
  const apiKey = isFeatureEnabled ? process.env.OPENAI_API_KEY : process.env.DISABLED_API;
  return new OpenAI({ apiKey });
}

export async function POST(req) {
  try {
    const body = await req.json();
    let { email, userId } = body;

    // If userId is missing, try to retrieve it from session
    if (!userId) {
      const session = await getSession(req);
      userId = session?.user?.sub;
      console.log("Retrieved userId from session:", userId);
    }

    // Check if both email and userId are present
    if (!email || !userId) {
      console.error('Email content or user ID is missing');
      return NextResponse.json({ message: 'Email content or user ID is missing' }, { status: 400 });
    }

    // Check if the "classifySpam" feature is enabled for the user
    const isFeatureEnabled = await getUserFeatureState(userId, 'classifySpam');
    console.log("Classify Spam feature status for user:", isFeatureEnabled ? "enabled" : "disabled");

    // Initialize OpenAI client based on feature status
    const openai = getOpenAIClient(isFeatureEnabled);

    // If the feature is disabled, do not proceed with OpenAI API call
    if (!isFeatureEnabled) {
      return NextResponse.json({ message: 'Classify spam feature is disabled for this user' }, { status: 403 });
    }

    // Construct email text for classification
    const emailText = `
      Classify the following email as either "Spam" or "Important":
      Subject: ${email.subject}
      Body: ${email.body}
    `;

    // Request classification from OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an assistant who helps classify emails as either spam or important.' },
        { role: 'user', content: emailText },
      ],
    });

    // Extract and return classification result
    const classification = response.choices[0].message.content.trim();
    return NextResponse.json({ classification }, { status: 200 });
  } catch (error) {
    console.error('Error classifying email:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
