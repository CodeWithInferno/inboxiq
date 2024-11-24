// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,  // Ensure API key is in environment variables
// });

// export async function POST(req) {
//   try {
//     const { emailBody } = await req.json();

//     if (!emailBody) {
//       return NextResponse.json({ message: 'Email body is missing' }, { status: 400 });
//     }

//     // Request a summary from OpenAI
//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         { role: 'system', content: 'You are an assistant that summarizes emails.' },
//         { role: 'user', content: `Please summarize this email: ${emailBody}` },
//       ],
//     });

//     const summary = response.choices[0].message.content.trim();

//     return NextResponse.json({ summary }, { status: 200 });
//   } catch (error) {
//     console.error('Error summarizing email:', error);
//     return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
//   }
// }







// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';
// import { getSession } from '@auth0/nextjs-auth0';
// import { getUserFeatureState } from '@/lib/getUserFeatureState';

// // Function to retrieve the OpenAI client with the correct API key based on feature status
// function getOpenAIClient(isFeatureEnabled) {
//   const apiKey = isFeatureEnabled ? process.env.OPENAI_API_KEY : process.env.DISABLED_API;
//   return new OpenAI({ apiKey });
// }

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     console.log("Request body received:", body);

//     let { emailBody, userId } = body;

//     // Attempt to retrieve userId from session if not provided in the request
//     if (!userId) {
//       const session = await getSession(req);
//       userId = session?.user?.sub;
//       console.log("Retrieved userId from session:", userId);
//     }

//     // Check if both emailBody and userId are available
//     if (!emailBody || !userId) {
//       console.error('Email body or user ID is missing');
//       return NextResponse.json({ message: 'Email body or user ID is missing' }, { status: 400 });
//     }

//     // Check if the "summarizeEmail" feature is enabled for the user
//     const isFeatureEnabled = await getUserFeatureState(userId, 'emailSummary');
//     console.log("Summarize Email feature status for user:", isFeatureEnabled ? "enabled" : "disabled", " | User ID:", userId);

//     // Initialize OpenAI client based on feature status
//     const openai = getOpenAIClient(isFeatureEnabled);

//     // If the feature is disabled, do not proceed with OpenAI API call
//     if (!isFeatureEnabled) {
//       return NextResponse.json({ message: 'Summarize email feature is disabled for this user' }, { status: 403 });
//     }

//     // Make a request to OpenAI API to get the summary
//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         { role: 'system', content: 'You are an assistant that summarizes emails.' },
//         { role: 'user', content: `Please summarize this email: ${emailBody}` },
//       ],
//     });

//     // Retrieve and return the summary
//     const summary = response.choices[0].message.content.trim();
//     console.log("Summary generated:", summary);

//     return NextResponse.json({ summary }, { status: 200 });
//   } catch (error) {
//     console.error('Error summarizing email:', error);
//     return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
//   }
// }


















import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getSession } from '@auth0/nextjs-auth0';
import { getUserFeatureState } from '@/lib/getUserFeatureState';
import { redactSensitiveInfo } from '@/utils/sensitiveInfo'; // Import sensitive info redaction utility

// Function to retrieve the OpenAI client with the correct API key based on feature status
function getOpenAIClient(isFeatureEnabled) {
  const apiKey = isFeatureEnabled ? process.env.OPENAI_API_KEY : process.env.DISABLED_API;
  return new OpenAI({ apiKey });
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Request body received:", body);

    let { emailBody, userId } = body;

    // Attempt to retrieve userId from session if not provided in the request
    if (!userId) {
      const session = await getSession(req);
      userId = session?.user?.sub;
      console.log("Retrieved userId from session:", userId);
    }

    // Check if both emailBody and userId are available
    if (!emailBody || !userId) {
      console.error('Email body or user ID is missing');
      return NextResponse.json({ message: 'Email body or user ID is missing' }, { status: 400 });
    }

    // Check if the "summarizeEmail" feature is enabled for the user
    const isFeatureEnabled = await getUserFeatureState(userId, 'emailSummary');
    console.log("Summarize Email feature status for user:", isFeatureEnabled ? "enabled" : "disabled", " | User ID:", userId);

    // Initialize OpenAI client based on feature status
    const openai = getOpenAIClient(isFeatureEnabled);

    // If the feature is disabled, do not proceed with OpenAI API call
    if (!isFeatureEnabled) {
      return NextResponse.json({ message: 'Summarize email feature is disabled for this user' }, { status: 403 });
    }

    // Redact sensitive information from the email body
    const sanitizedEmailBody = redactSensitiveInfo(emailBody);
    console.log("Sanitized email body:", sanitizedEmailBody);

    // Make a request to OpenAI API to get the summary
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an assistant that summarizes emails.' },
        { role: 'user', content: `Please summarize this email: ${sanitizedEmailBody}` },
      ],
    });

    // Retrieve and return the summary
    const summary = response.choices[0].message.content.trim();
    console.log("Summary generated:", summary);

    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    console.error('Error summarizing email:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
