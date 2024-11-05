// import { google } from 'googleapis';
// import OpenAI from 'openai';
// import { getSession } from '@auth0/nextjs-auth0';
// import getUserTokens from '@/lib/getUserTokens';

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function POST(req) {
//   try {
//     const session = await getSession(req);
//     const user = session?.user;

//     if (!user) {
//       return new Response(JSON.stringify({ message: 'User not authenticated' }), {
//         status: 401,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     const userTokens = await getUserTokens(user.email);

//     if (!userTokens || !userTokens.access_token) {
//       return new Response(JSON.stringify({ message: 'User tokens not found or invalid' }), {
//         status: 401,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     const oauth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET
//     );
//     oauth2Client.setCredentials({
//       access_token: userTokens.access_token,
//       refresh_token: userTokens.refresh_token,
//     });

//     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

//     const response = await gmail.users.messages.list({
//       userId: 'me',
//       labelIds: ['INBOX'],
//       maxResults: 10,
//     });

//     const messages = response.data.messages || [];
//     if (messages.length === 0) {
//       return new Response(JSON.stringify({ message: 'No new emails to classify' }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     const labelMapping = {
//       Spam: 'SPAM',
//       Promotions: 'CATEGORY_PROMOTIONS',
//       Social: 'CATEGORY_SOCIAL',
//     };

//     const classifiedEmails = await Promise.all(
//       messages.map(async (msg) => {
//         const email = await gmail.users.messages.get({ userId: 'me', id: msg.id });
//         const emailContent = {
//           subject: email.data.payload.headers.find((header) => header.name === 'Subject')?.value || '',
//           body: email.data.snippet || '',
//         };

//         const emailText = `Classify the following email as "Spam", "Promotions", or "Social":
//           Subject: ${emailContent.subject}
//           Body: ${emailContent.body}
//         `;

//         const openaiResponse = await openai.chat.completions.create({
//           model: 'gpt-3.5-turbo',
//           messages: [
//             { role: 'system', content: 'You are a classification assistant for emails.' },
//             { role: 'user', content: emailText },
//           ],
//         });

//         const category = openaiResponse.choices[0]?.message?.content?.trim();
        
//         if (!category) {
//           console.error("Category missing from OpenAI response for email ID:", msg.id);
//           return { id: msg.id, category: 'Unclassified', success: false };
//         }

//         const gmailLabel = labelMapping[category];
        
//         if (gmailLabel) {
//           const labelResult = await gmail.users.messages.modify({
//             userId: 'me',
//             id: msg.id,
//             requestBody: { addLabelIds: [gmailLabel] },
//           });
//           return { id: msg.id, category, success: !!labelResult };
//         } else {
//           console.warn(`No matching Gmail label found for category: ${category}`);
//           return { id: msg.id, category: 'Unclassified', success: false };
//         }
//       })
//     );

//     return new Response(
//       JSON.stringify({ message: 'Emails classified and labeled', classifiedEmails }),
//       {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   } catch (error) {
//     console.error('Error classifying and labeling emails:', error);
//     return new Response(JSON.stringify({ message: 'Internal Server Error', details: error.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }





// src/app/api/ai/email/labeling.js
import { google } from 'googleapis';
import OpenAI from 'openai';
import { getSession } from '@auth0/nextjs-auth0';
import getUserTokens from '@/lib/getUserTokens';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const LABEL_MAPPING = {
  Spam: 'SPAM',
  Promotions: 'CATEGORY_PROMOTIONS',
  Social: 'CATEGORY_SOCIAL',
};

export async function POST(req) {
  try {
    const session = await getSession(req);
    const user = session?.user;

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { email } = await req.json();
    console.log("Received email in labeling:", email); // Log the received email data

    if (!email.id) {
      console.error("Error: Email ID is undefined");
      return new Response(JSON.stringify({ message: 'Email ID is missing' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userTokens = await getUserTokens(user.email);
    if (!userTokens || !userTokens.access_token) {
      return new Response(JSON.stringify({ message: 'User tokens not found or invalid' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      access_token: userTokens.access_token,
      refresh_token: userTokens.refresh_token,
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const openaiResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a classifier that labels emails. You must choose one of these categories for each email: "Spam", "Promotions", "Social", or "Unclassified". Only return the category name without additional information.',
        },
        {
          role: 'user',
          content: `Classify this email. Subject: ${email.subject}\nBody: ${email.body}`,
        },
      ],
    });

    const category = openaiResponse?.choices[0]?.message?.content?.trim();
    console.log('Labeling Result:', { emailId: email.id, category });

    const gmailLabel = LABEL_MAPPING[category] || null;

    if (gmailLabel) {
      await gmail.users.messages.modify({
        userId: 'me',
        id: email.id,
        requestBody: {
          addLabelIds: [gmailLabel],
        },
      });
      console.log(`Email ID: ${email.id} labeled as ${category} (${gmailLabel})`);
    } else {
      console.log(`Email ID: ${email.id} classified as "Unclassified", no label applied.`);
    }

    return new Response(JSON.stringify({ category }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error labeling email:', error.message);
    return new Response(JSON.stringify({ message: 'Internal Server Error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
