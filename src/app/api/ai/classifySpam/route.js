import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email content is missing' }, { status: 400 });
    }

    const emailText = `
      Classify the following email as either "Spam" or "Important":
      Subject: ${email.subject}
      Body: ${email.body}
    `;

    // Call OpenAI API (Chatgpt-3.5-turbo)
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an assistant who helps classify emails as either spam or important.' },
        { role: 'user', content: emailText },
      ],
    });

    const classification = response.choices[0].message.content.trim();

    return NextResponse.json({ classification }, { status: 200 });
  } catch (error) {
    console.error('Error classifying email:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}










// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';
// import { getUserFeatureState } from '@/lib/getUserFeatureState';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req) {
//   try {
//     const { email, userId } = await req.json();

//     if (!email || !userId) {
//       return NextResponse.json({ message: 'Email content or user ID is missing' }, { status: 400 });
//     }

//     // Check if the "classifySpam" feature is enabled for the user
//     const isFeatureEnabled = await getUserFeatureState(userId, 'classifySpam');
//     if (!isFeatureEnabled) {
//       return NextResponse.json({ message: 'Spam classification feature is disabled for this user' }, { status: 403 });
//     }

//     const emailText = `
//       Classify the following email as either "Spam" or "Important":
//       Subject: ${email.subject}
//       Body: ${email.body}
//     `;

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
