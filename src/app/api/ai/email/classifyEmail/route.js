// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req) {
//   try {
//     const { email } = await req.json();

//     if (!email) {
//       return NextResponse.json({ message: 'Email content is missing' }, { status: 400 });
//     }

//     // Check if OpenAI should be used based on the environment variable
//     if (process.env.USE_OPENAI === 'false') {
//       // If not, return a default low priority
//       return NextResponse.json({ priority: 'Low Priority (OpenAI Disabled)' }, { status: 200 });
//     }

//     const emailText = `
//       Classify the following email as "High Priority" or "Low Priority":
//       Email Content:
//       Subject: ${email.subject}
//       Body: ${email.body}
//     `;

//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         { role: 'system', content: 'You are an email assistant who helps classify emails based on priority.' },
//         { role: 'user', content: emailText },
//       ],
//     });

//     const classification = response.choices[0].message.content.trim();

//     return NextResponse.json({ priority: classification }, { status: 200 });
//   } catch (error) {
//     console.error('Error classifying email:', error);
//     return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
//   }
// }






// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';
// import { getSession } from '@auth0/nextjs-auth0';
// import { getUserFeatureState } from '@/lib/getUserFeatureState';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req) {
//   try {
//     const session = await getSession(req);
//     const userId = session?.user?.sub;
//     const { email } = await req.json();

//     if (!email || !userId) {
//       console.error("Email content or user ID is missing");
//       return NextResponse.json({ message: 'Email content or user ID is missing' }, { status: 400 });
//     }

//     // Check if the "classifyPriority" feature is enabled for the user
//     const isFeatureEnabled = await getUserFeatureState(userId, 'classifyPriority');
//     if (!isFeatureEnabled) {
//       console.log("Feature is disabled, skipping OpenAI API call.");
//       return NextResponse.json({ message: 'Priority classification feature is disabled for this user' }, { status: 403 });
//     }

//     // Log email content only if the feature is enabled
//     console.log("Feature is enabled, proceeding with OpenAI API call.");
//     console.log("Received email:", email);

//     // If feature is enabled, proceed with the OpenAI API call
//     const emailText = `
//       Classify the following email as "High Priority" or "Low Priority":
//       Email Content:
//       Subject: ${email.subject}
//       Body: ${email.body}
//     `;

//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         { role: 'system', content: 'You are an email assistant who helps classify emails based on priority.' },
//         { role: 'user', content: emailText },
//       ],
//     });

//     const classification = response.choices[0].message.content.trim();
//     console.log("Classification result:", classification);

//     return NextResponse.json({ priority: classification }, { status: 200 });
//   } catch (error) {
//     console.error('Error classifying email:', error);
//     return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
//   }
// }





















import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getSession } from '@auth0/nextjs-auth0';
import { getUserFeatureState } from '@/lib/getUserFeatureState';
import { redactSensitiveInfo } from '@/utils/sensitiveInfo';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    // Get the user session
    const session = await getSession(req);
    const userId = session?.user?.sub;

    // Parse the request body for the email
    const { email } = await req.json();

    if (!email || !userId) {
      console.error("Email content or user ID is missing");
      return NextResponse.json({ message: 'Email content or user ID is missing' }, { status: 400 });
    }

    // Check if the "classifyPriority" feature is enabled for the user
    const isFeatureEnabled = await getUserFeatureState(userId, 'classifyPriority');
    if (!isFeatureEnabled) {
      console.log("Feature is disabled, skipping OpenAI API call.");
      return NextResponse.json({ message: 'Priority classification feature is disabled for this user' }, { status: 403 });
    }

    // Redact sensitive information from the email content
    const sanitizedEmail = {
      subject: redactSensitiveInfo(email.subject),
      body: redactSensitiveInfo(email.body),
    };

    console.log("Sanitized email:", sanitizedEmail);

    // Prepare the email text for classification
    const emailText = `
      Classify the following email as "High Priority" or "Low Priority":
      Email Content:
      Subject: ${sanitizedEmail.subject}
      Body: ${sanitizedEmail.body}
    `;

    // Call OpenAI API to classify the email
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an email assistant who helps classify emails based on priority.' },
        { role: 'user', content: emailText },
      ],
    });

    const classification = response.choices[0].message.content.trim();
    console.log("Classification result:", classification);

    return NextResponse.json({ priority: classification }, { status: 200 });
  } catch (error) {
    console.error('Error classifying email:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
