// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';

// // Initialize OpenAI Client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set in the environment variables
// });

// export async function POST(req) {
//   try {
//     const { emailBody } = await req.json();

//     if (!emailBody) {
//       return NextResponse.json({ message: 'Email content is missing' }, { status: 400 });
//     }

//     const prompt = `
//       Analyze the sentiment of the following email and classify it as Positive, Neutral, or Negative:
//       Email Body:
//       "${emailBody}"
//     `;

//     // Call OpenAI API (Chatgpt-3.5-turbo)
//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         { role: 'system', content: 'You are a sentiment analysis assistant.' },
//         { role: 'user', content: prompt },
//       ],
//     });

//     const sentiment = response.choices[0].message.content.trim();

//     return NextResponse.json({ sentiment }, { status: 200 });
//   } catch (error) {
//     console.error('Error analyzing sentiment:', error);
//     return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
//   }
// }










// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';

// // Initialize OpenAI Client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set in the environment variables
// });

// // Helper function to strip HTML tags using regex
// function stripHTML(html) {
//   return html.replace(/<[^>]*>?/gm, '');
// }

// export async function POST(req) {
//   try {
//     const { emailBody } = await req.json();

//     if (!emailBody) {
//       return NextResponse.json({ message: 'Email content is missing' }, { status: 400 });
//     }

//     // Remove HTML tags from the email body
//     const cleanedEmailBody = stripHTML(emailBody);

//     // Truncate the email to the first 100 words
//     const truncatedEmail = cleanedEmailBody.split(" ").slice(0, 1000).join(" ");

//     const prompt = `
//       Analyze the sentiment of the following email and classify it as Positive, Neutral, or Negative:
//       Email Body:
//       "${truncatedEmail}"
//     `;

//       console.log(truncatedEmail);
//     // Call OpenAI API (Chatgpt-3.5-turbo)
//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         { role: 'system', content: 'You are a sentiment analysis assistant.' },
//         { role: 'user', content: prompt },
//       ],
//     });

//     const sentiment = response.choices[0].message.content.trim();

//     return NextResponse.json({ sentiment }, { status: 200 });
//   } catch (error) {
//     console.error('Error analyzing sentiment:', error);
//     return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
//   }
// }








// import OpenAI from 'openai';
// import { getSession } from '@auth0/nextjs-auth0'; // If using Auth0
// import { getUserFeatureState } from '@/lib/getUserFeatureState';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Helper function to strip HTML tags using regex
// function stripHTML(html) {
//   return html.replace(/<[^>]*>?/gm, '');
// }

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     console.log('Received request body:', body);

//     let { emailBody, userId } = body;

//     if (!userId) {
//       const session = await getSession(req);
//       userId = session?.user?.sub;
//       console.log("Retrieved userId from session:", userId);
//     }

//     if (!emailBody || !userId) {
//       console.error('Missing emailBody or userId:', { emailBody, userId });
//       return new Response(null, { status: 204 }); // No content response
//     }

//     const isFeatureEnabled = await getUserFeatureState(userId, 'sentimentAnalysis');
//     console.log(`Feature enabled for user ${userId}:`, isFeatureEnabled);

//     if (!isFeatureEnabled) {
//       return new Response(null, { status: 403 });
//     }

//     const cleanedEmailBody = stripHTML(emailBody);
//     const truncatedEmail = cleanedEmailBody.split(" ").slice(0, 1000).join(" ");
//     console.log('Truncated Email:', truncatedEmail);

//     const prompt = `
//       Analyze the sentiment of the following email and classify it as Positive, Neutral, or Negative:
//       Email Body:
//       "${truncatedEmail}"
//     `;

//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         { role: 'system', content: 'You are a sentiment analysis assistant.' },
//         { role: 'user', content: prompt },
//       ],
//     });

//     const sentiment = response.choices[0]?.message?.content.trim() || 'No response';
//     console.log('Sentiment:', sentiment);

//     // Return a response without additional message content
//     return new Response(JSON.stringify({ sentiment }), { status: 200 });
//   } catch (error) {
//     console.error('Error analyzing sentiment:', error);
//     return new Response(null, { status: 500 });
//   }
// }
























import OpenAI from 'openai';
import { getSession } from '@auth0/nextjs-auth0'; // If using Auth0
import { getUserFeatureState } from '@/lib/getUserFeatureState';
import { sanitizeHtmlEmail } from '@/utils/sensitiveInfo'; // Importing the sanitization utility

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to strip HTML tags using regex
function stripHTML(html) {
  return html.replace(/<[^>]*>?/gm, '');
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('Received request body:', body);

    let { emailBody, userId } = body;

    // Retrieve user ID from session if not provided
    if (!userId) {
      const session = await getSession(req);
      userId = session?.user?.sub;
      console.log('Retrieved userId from session:', userId);
    }

    if (!emailBody || !userId) {
      console.error('Missing emailBody or userId:', { emailBody, userId });
      return new Response(null, { status: 204 }); // No content response
    }

    // Check if the feature is enabled for the user
    const isFeatureEnabled = await getUserFeatureState(userId, 'sentimentAnalysis');
    console.log(`Feature enabled for user ${userId}:`, isFeatureEnabled);

    if (!isFeatureEnabled) {
      return new Response(null, { status: 403 }); // Forbidden
    }

    // Sanitize and process the email body
    const sanitizedEmailBody = sanitizeHtmlEmail(emailBody); // Sanitizing sensitive info
    console.log('Sanitized Email Body:', sanitizedEmailBody);

    const cleanedEmailBody = stripHTML(sanitizedEmailBody); // Strip remaining HTML tags
    const truncatedEmail = cleanedEmailBody.split(' ').slice(0, 10000).join(' '); // Limit to 1000 words
    console.log('Truncated Email:', truncatedEmail);

    // Prompt for OpenAI
    const prompt = `
      Analyze the sentiment of the following email and classify it as Positive, Neutral, or Negative:
      Email Body:
      "${truncatedEmail}"
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a sentiment analysis assistant.' },
        { role: 'user', content: prompt },
      ],
    });

    const sentiment = response.choices[0]?.message?.content.trim() || 'No response';
    console.log('Sentiment:', sentiment);

    // Return a JSON response with the sentiment result
    return new Response(JSON.stringify({ sentiment }), { status: 200 });
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return new Response(null, { status: 500 });
  }
}
