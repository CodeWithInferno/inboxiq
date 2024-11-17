// import { google } from 'googleapis';
// import OpenAI from 'openai';
// import { getSession } from '@auth0/nextjs-auth0';
// import getUserTokens from '@/lib/getUserTokens';
// import { connectToDatabase } from '@/lib/mongodb';
// import sanitizeEmailContent from '@/utils/sanitizeEmailContent';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req) {
//   try {
//     // Get user session
//     const session = await getSession(req);
//     const user = session?.user;

//     if (!user) {
//       return new Response(
//         JSON.stringify({ message: 'User not authenticated' }),
//         { status: 401 }
//       );
//     }

//     const userId = user.sub;
//     const db = await connectToDatabase();

//     // Fetch user tokens securely using getUserTokens
//     const userTokens = await getUserTokens(user.email);
//     if (!userTokens) {
//       return new Response(
//         JSON.stringify({ message: 'User tokens not found' }),
//         { status: 401 }
//       );
//     }

//     // Initialize Google OAuth2 client
//     const redirectUri =
//       process.env.NODE_ENV === 'development'
//         ? 'http://localhost:3000/api/auth/google/callback'
//         : 'https://your-production-url.com/api/auth/google/callback';

//     const oauth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET,
//       redirectUri
//     );

//     oauth2Client.setCredentials({
//       access_token: userTokens.access_token,
//       refresh_token: userTokens.refresh_token,
//     });

//     // Initialize Gmail API client
//     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

//     // Fetch unread spam and promotion emails
//     const fetchEmails = async (label) => {
//       const response = await gmail.users.messages.list({
//         userId: 'me',
//         labelIds: [label],
//         q: 'is:unread',
//         maxResults: 50, // Adjust the limit as needed
//       });
//       return response.data.messages || [];
//     };

//     const spamEmails = await fetchEmails('SPAM');
//     const promotionEmails = await fetchEmails('CATEGORY_PROMOTIONS');

//     if (spamEmails.length === 0 && promotionEmails.length === 0) {
//       return new Response(
//         JSON.stringify({ message: 'No spam or promotion emails found' }),
//         { status: 200 }
//       );
//     }

//     // Fetch and sanitize email content
//     const fetchAndSanitizeEmail = async (email) => {
//       const message = await gmail.users.messages.get({
//         userId: 'me',
//         id: email.id, // Save this ID as "emailId"
//       });

//       const headers = message.data.payload.headers || [];
//       const subject =
//         headers.find((header) => header.name === 'Subject')?.value || 'No Subject';
//       const fromHeader =
//         headers.find((header) => header.name === 'From')?.value || 'Unknown Sender';
//       const [senderName, senderEmail] = fromHeader.match(/(.*) <(.*)>/)?.slice(1) || [
//         'Unknown Sender',
//         'Unknown Email',
//       ];
//       const body =
//         message.data.payload.parts?.[0]?.body?.data
//           ? Buffer.from(message.data.payload.parts[0].body.data, 'base64').toString('utf-8')
//           : 'No Content';

//       return {
//         emailId: email.id, // Save this for future unsubscribe actions
//         subject,
//         senderName,
//         senderEmail,
//         body: sanitizeEmailContent(body),
//       };
//     };

//     const combinedEmails = [
//       ...(await Promise.all(spamEmails.map(fetchAndSanitizeEmail))),
//       ...(await Promise.all(promotionEmails.map(fetchAndSanitizeEmail))),
//     ];

//     // Count emails per sender
//     const emailStats = {};
//     for (const email of combinedEmails) {
//       if (!emailStats[email.senderEmail]) {
//         emailStats[email.senderEmail] = { senderName: email.senderName, count: 0 };
//       }
//       emailStats[email.senderEmail].count += 1;
//     }

//     const results = [];

//     for (const email of combinedEmails) {
//       const prompt = `
// You are an email assistant. Analyze the provided email and determine if it is unsubscribable. An unsubscribable email contains content that allows the user to stop receiving emails by clicking a link, replying, or following instructions. Respond with "Yes" or "No", and optionally include a reason.

// Email:
// Subject: ${email.subject}
// Body: ${email.body}
// `;

//       // Call OpenAI API for each email
//       const openaiResponse = await openai.chat.completions.create({
//         model: 'gpt-3.5-turbo',
//         messages: [
//           {
//             role: 'system',
//             content: 'You are an email assistant.',
//           },
//           {
//             role: 'user',
//             content: prompt,
//           },
//         ],
//         max_tokens: 500,
//         temperature: 0.2,
//       });

//       const openAIResult = openaiResponse.choices[0].message.content.trim();

//       // Include count from emailStats in the results
//       results.push({
//         emailId: email.emailId, // Include emailId in the results
//         subject: email.subject,
//         senderName: email.senderName,
//         senderEmail: email.senderEmail,
//         body: email.body,
//         unsubscribable: openAIResult,
//         count: emailStats[email.senderEmail]?.count || 0, // Include the count here
//       });
//     }

//     // Save results in MongoDB
//     await db.collection('Newsletters').updateOne(
//       { userId },
//       { $set: { userId, results, timestamp: new Date() } },
//       { upsert: true }
//     );

//     // Save email statistics in MongoDB
//     const emailStatsArray = Object.entries(emailStats).map(([email, data]) => ({
//       senderEmail: email,
//       senderName: data.senderName,
//       count: data.count,
//     }));

//     await db.collection('EmailStats').updateOne(
//       { userId },
//       { $set: { userId, emailStats: emailStatsArray, timestamp: new Date() } },
//       { upsert: true }
//     );

//     // Return the results
//     return new Response(JSON.stringify({ message: 'Processed successfully', results }), {
//       status: 200,
//     });
//   } catch (error) {
//     console.error('Error in unsubscribeScan API:', error);
//     return new Response(
//       JSON.stringify({ message: 'Internal server error', error: error.message }),
//       { status: 500 }
//     );
//   }
// }






















import { google } from 'googleapis';
import OpenAI from 'openai';
import { getSession } from '@auth0/nextjs-auth0';
import getUserTokens from '@/lib/getUserTokens';
import { connectToDatabase } from '@/lib/mongodb';
import sanitizeEmailContent from '@/utils/sanitizeEmailContent';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    // Get user session
    const session = await getSession(req);
    const user = session?.user;

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User not authenticated' }),
        { status: 401 }
      );
    }

    const userId = user.sub;
    const db = await connectToDatabase();

    // Fetch user tokens securely using getUserTokens
    const userTokens = await getUserTokens(user.email);
    if (!userTokens) {
      return new Response(
        JSON.stringify({ message: 'User tokens not found' }),
        { status: 401 }
      );
    }

    // Initialize Google OAuth2 client
    const redirectUri =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api/auth/google/callback'
        : 'https://your-production-url.com/api/auth/google/callback';

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    oauth2Client.setCredentials({
      access_token: userTokens.access_token,
      refresh_token: userTokens.refresh_token,
    });

    // Initialize Gmail API client
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Fetch unread spam and promotion emails
    const fetchEmails = async (label) => {
      const response = await gmail.users.messages.list({
        userId: 'me',
        labelIds: [label],
        q: 'is:unread',
        maxResults: 50,
      });
      return response.data.messages || [];
    };

    const spamEmails = await fetchEmails('SPAM');
    const promotionEmails = await fetchEmails('CATEGORY_PROMOTIONS');

    if (spamEmails.length === 0 && promotionEmails.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No spam or promotion emails found' }),
        { status: 200 }
      );
    }

    // Fetch and sanitize email content
    const fetchAndSanitizeEmail = async (email) => {
      const message = await gmail.users.messages.get({
        userId: 'me',
        id: email.id, // Save this ID as "emailId"
      });

      const headers = message.data.payload.headers || [];
      const subject =
        headers.find((header) => header.name === 'Subject')?.value || 'No Subject';
      const fromHeader =
        headers.find((header) => header.name === 'From')?.value || 'Unknown Sender';
      const [senderName, senderEmail] = fromHeader.match(/(.*) <(.*)>/)?.slice(1) || [
        'Unknown Sender',
        'Unknown Email',
      ];
      const body =
        message.data.payload.parts?.[0]?.body?.data
          ? Buffer.from(message.data.payload.parts[0].body.data, 'base64').toString('utf-8')
          : 'No Content';

      return {
        emailId: email.id, // Save this for future unsubscribe actions
        subject,
        senderName,
        senderEmail,
        body: sanitizeEmailContent(body),
      };
    };

    const combinedEmails = [
      ...(await Promise.all(spamEmails.map(fetchAndSanitizeEmail))),
      ...(await Promise.all(promotionEmails.map(fetchAndSanitizeEmail))),
    ];

    // Normalize domain
    const normalizeDomain = (email) => {
      const match = email.match(/@([a-z0-9.-]+\.[a-z]{2,})$/i);
      return match ? match[1] : email;
    };

    // Fetch and group emails by normalized domain AND senderName
    const groupedEmails = {};
    for (const email of combinedEmails) {
      const normalizedDomain = normalizeDomain(email.senderEmail);
      const uniqueKey = `${normalizedDomain}_${email.senderName}`; // Use both domain and senderName

      if (!groupedEmails[uniqueKey]) {
        groupedEmails[uniqueKey] = {
          senderName: email.senderName,
          normalizedDomain,
          senderEmail: email.senderEmail, // Store full senderEmail for debugging
          count: 0,
          emailIds: [],
          latestSubject: email.subject, // Save the latest subject for display
        };
      }

      groupedEmails[uniqueKey].count += 1;
      groupedEmails[uniqueKey].emailIds.push(email.emailId);
    }

    // Process grouped emails
    const results = [];
    for (const key in groupedEmails) {
      const group = groupedEmails[key];

      const prompt = `
You are an email assistant. Analyze the provided email and determine if it is unsubscribable. An unsubscribable email contains content that allows the user to stop receiving emails by clicking a link, replying, or following instructions. Respond with "Yes" or "No", and optionally include a reason.

Email:
Subject: ${group.latestSubject}
Body: ${group.emailIds.length > 0 ? 'Multiple emails with similar content.' : ''}
`;

      // Call OpenAI API for each group
      const openaiResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an email assistant.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.2,
      });

      const openAIResult = openaiResponse.choices[0].message.content.trim();

      // Push consolidated data into results
      results.push({
        senderName: group.senderName,
        normalizedDomain: group.normalizedDomain,
        senderEmail: group.senderEmail,
        count: group.count,
        emailIds: group.emailIds,
        unsubscribable: openAIResult,
      });
    }

    // Save results to MongoDB
    await db.collection('Newsletters').updateOne(
      { userId },
      { $set: { userId, results, timestamp: new Date() } },
      { upsert: true }
    );

    return new Response(JSON.stringify({ message: 'Processed successfully', results }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error in unsubscribeScan API:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error', error: error.message }),
      { status: 500 }
    );
  }
}
