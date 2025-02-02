// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';
// import { getSession } from '@auth0/nextjs-auth0';

// // Initialize OpenAI client with the provided API key
// function getOpenAIClient(apiKey) {
//   return new OpenAI({ apiKey });
// }

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { emailContent } = body;

//     // Check for email content
//     if (!emailContent) {
//       console.error('Email content is missing');
//       return NextResponse.json({ message: 'Email content is required' }, { status: 400 });
//     }

//     // Initialize OpenAI client
//     const openai = getOpenAIClient(process.env.OPENAI_API_KEY);

//     // Construct the prompt for detecting events in the email content
//     const prompt = `
//       Analyze the following email content and detect any event-related information:
//       - Title or purpose of the event
//       - Date of the event
//       - Time of the event

//       Respond with a JSON object in the format:
//       { "title": "Event Title", "date": "YYYY-MM-DD", "time": "HH:mm" }

//       Email content:
//       """${emailContent}"""
//     `;

//     // Make request to OpenAI API
//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         { role: 'system', content: 'You are an assistant that helps detect event information in emails.' },
//         { role: 'user', content: prompt },
//       ],
//       max_tokens: 150,
//       temperature: 0.2,
//     });

//     // Parse and send the result back
//     const detectedEvent = JSON.parse(response.choices[0].message.content.trim());
//     return NextResponse.json({ eventDetected: !!detectedEvent.date, event: detectedEvent }, { status: 200 });
//   } catch (error) {
//     console.error('Error detecting event:', error);
//     return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
//   }
// }























// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';
// import { getSession } from '@auth0/nextjs-auth0';
// import sanitizeEmailContent from '@/utils/sanitizeEmailContent'; // Import sanitize utility

// // Initialize OpenAI client with the provided API key
// function getOpenAIClient(apiKey) {
//   return new OpenAI({ apiKey });
// }

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { emailContent } = body;

//     // Check for email content
//     if (!emailContent) {
//       console.error('Email content is missing');
//       return NextResponse.json({ message: 'Email content is required' }, { status: 400 });
//     }

//     // Sanitize the email content
//     const cleanedContent = sanitizeEmailContent(emailContent);

//     // Initialize OpenAI client
//     const openai = getOpenAIClient(process.env.OPENAI_API_KEY);

//     // Construct the prompt for detecting events in the email content
//     const prompt = `
//       Analyze the following email content and detect any event-related information:
//       - Title or purpose of the event
//       - Date of the event
//       - Time of the event

//       Respond with a JSON object in the format:
//       { "title": "Event Title", "date": "YYYY-MM-DD", "time": "HH:mm" }

//       Email content:
//       """${cleanedContent}"""
//     `;

//     // Make request to OpenAI API
//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         { role: 'system', content: 'You are an assistant that helps detect event information in emails.' },
//         { role: 'user', content: prompt },
//       ],
//       max_tokens: 150,
//       temperature: 0.2,
//     });

//     // Parse and send the result back
//     const detectedEvent = JSON.parse(response.choices[0].message.content.trim());
//     return NextResponse.json({ eventDetected: !!detectedEvent.date, event: detectedEvent }, { status: 200 });
//   } catch (error) {
//     console.error('Error detecting event:', error);
//     return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
//   }
// }
















import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getSession } from '@auth0/nextjs-auth0';
import sanitizeEmailContent from '@/utils/sanitizeEmailContent'; // Import sanitize utility

// Initialize OpenAI client with the provided API key
function getOpenAIClient(apiKey) {
  return new OpenAI({ apiKey });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { emailContent } = body;

    // Check for email content
    if (!emailContent) {
      console.error('Email content is missing');
      return NextResponse.json({ message: 'Email content is required' }, { status: 400 });
    }

    // Sanitize the email content
    const cleanedContent = sanitizeEmailContent(emailContent);
    console.log('Sanitized Email Content:', cleanedContent); // Log sanitized content for debugging

    // Initialize OpenAI client
    const openai = getOpenAIClient(process.env.OPENAI_API_KEY);

    // Construct the prompt for detecting events in the email content
    const prompt = `
      Analyze the following email content and detect any event-related information:
      - Title or purpose of the event
      - Date of the event
      - Time of the event

      Respond with a JSON object in the format:
      { "title": "Event Title", "date": "YYYY-MM-DD", "time": "HH:mm" }

      Email content:
      """${cleanedContent}"""
    `;

    // Make request to OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an assistant that helps detect event information in emails.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 150,
      temperature: 0.2,
    });

    // Parse and send the result back
    const detectedEvent = JSON.parse(response.choices[0].message.content.trim());
    console.log('Detected Event:', detectedEvent); // Log the detected event for debugging

    return NextResponse.json(
      { eventDetected: !!detectedEvent.date, event: detectedEvent },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error detecting event:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}
