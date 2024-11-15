// import { google } from 'googleapis';
// import { getSession } from '@auth0/nextjs-auth0';
// import { connectToDatabase } from '@/lib/mongodb';
// import { classifyEmailContent } from '../../../../utils/openai';
// import { archiveEmail, deleteEmail } from '../../../../utils/emailActions';
// import getUserTokens from '@/lib/getUserTokens';

// export async function POST(req) {
//   console.log("BlockCold API: Received request");

//   const session = await getSession(req);
//   const user = session?.user;

//   if (!user) {
//     console.log("User not authenticated");
//     return new Response(JSON.stringify({ message: 'User not authenticated' }), {
//       status: 401,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   try {
//     console.log(`Fetching ColdEmailSettings for user: ${user.sub}`);
//     const db = await connectToDatabase();
//     const userSettings = await db.collection('ColdEmail').findOne({ userId: user.sub });

//     if (!userSettings || !userSettings.isEnabled) {
//       console.log("Cold email blocker is disabled or no settings found.");
//       return new Response(JSON.stringify({ message: 'Cold email blocker is disabled', blockedEmails: [] }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     console.log(`Fetching tokens for email: ${user.email}`);
//     const userTokens = await getUserTokens(user.email);
//     if (!userTokens || !userTokens.access_token || !userTokens.refresh_token) {
//       console.log("User tokens not found or incomplete.");
//       return new Response(JSON.stringify({ message: 'User tokens not found or incomplete' }), {
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

//     console.log("Fetching unread emails...");
//     const emailResponse = await gmail.users.messages.list({
//       userId: 'me',
//       q: 'is:unread',
//       maxResults: 10,
//     });

//     if (!emailResponse.data.messages) {
//       console.log("No unread emails found.");
//       return new Response(JSON.stringify({ message: 'No unread emails found', blockedEmails: [] }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     const blockedEmails = [];
//     const coldEmailThreshold = userSettings.threshold || 7;

//     const classifyAndProcessEmail = async (messageId) => {
//       console.log(`Processing message ID: ${messageId}`);
//       const msg = await gmail.users.messages.get({ userId: 'me', id: messageId });
//       const emailContent = Buffer.from(msg.data.payload.parts?.[0]?.body?.data || '', 'base64').toString('utf-8');

//       const userPrompt = userSettings.prompt || '';
//       const prompt = `On a scale of 1 to 10, where 1 is very unlikely and 10 is highly likely, respond with only a single number to rate how much this email seems like a cold email based on factors like generic greeting, promotional language, urgency, and these user-defined flags: ${userPrompt}`;

//       console.log(`Sending email content to classify with prompt: ${prompt}`);
//       const response = await classifyEmailContent(emailContent, prompt);
//       const classificationScore = parseInt(response?.trim(), 10);
//       console.log(`Received classification score: ${classificationScore} for message ID: ${messageId}`);

//       if (classificationScore >= coldEmailThreshold) {
//         console.log(`Classification score exceeds threshold (${coldEmailThreshold}). Applying action.`);
//         if (userSettings.action === 'archive') {
//           await archiveEmail(gmail, messageId);
//           console.log(`Email archived: ${messageId}`);
//         } else if (userSettings.action === 'delete') {
//           await deleteEmail(gmail, messageId);
//           console.log(`Email deleted: ${messageId}`);
//         }
//         blockedEmails.push(messageId);
//       } else {
//         console.log(`Email classification score below threshold. No action taken for message ID: ${messageId}`);
//       }
//     };

//     console.log("Starting classification of unread emails...");
//     await Promise.all(emailResponse.data.messages.map((msg) => classifyAndProcessEmail(msg.id)));

//     console.log("Cold email processing completed.");
//     return new Response(JSON.stringify({ message: 'Cold emails processed', blockedEmails }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error processing cold emails:', error);
//     return new Response(JSON.stringify({ message: 'Internal server error', details: error.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }

























import { google } from 'googleapis';
import { getSession } from '@auth0/nextjs-auth0';
import { connectToDatabase } from '@/lib/mongodb';
import { classifyEmailContent } from '../../../../utils/openai';
import getUserTokens from '@/lib/getUserTokens';

export async function POST(req) {
  try {
    // Get the user session
    const session = await getSession(req);
    const user = session?.user;

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not authenticated' }), { status: 401 });
    }

    // Define the redirect URI dynamically based on the environment
    const redirectUri =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api/auth/google/callback' // Development redirect URI
        : 'https://inboxiq-seven.vercel.app/api/auth/google/callback'; // Production redirect URI

    // Initialize the Google OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    // Connect to the database and fetch user settings
    const db = await connectToDatabase();
    const userSettings = await db.collection('ColdEmail').findOne({ userId: user.sub });

    if (!userSettings || !userSettings.isEnabled) {
      return new Response(
        JSON.stringify({ message: 'Cold email blocker is disabled' }),
        { status: 200 }
      );
    }

    // Get user tokens for Gmail API
    const userTokens = await getUserTokens(user.email);
    if (!userTokens) {
      return new Response(JSON.stringify({ message: 'User tokens not found' }), { status: 401 });
    }

    // Set OAuth2 client credentials
    oauth2Client.setCredentials({
      access_token: userTokens.access_token,
      refresh_token: userTokens.refresh_token,
    });

    // Initialize Gmail API client
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Fetch unread emails
    const emailResponse = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread',
      maxResults: 10,
    });

    if (!emailResponse.data.messages || emailResponse.data.messages.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No unread emails found' }),
        { status: 200 }
      );
    }

    // Classify emails and store blocked ones
    const blockedEmails = [];
    const coldEmailThreshold = userSettings.threshold || 7;

    const classifyAndProcessEmail = async (messageId) => {
      try {
        // Fetch individual email details
        const msg = await gmail.users.messages.get({ userId: 'me', id: messageId });
        const emailContent =
          msg.data.payload.parts?.[0]?.body?.data
            ? Buffer.from(msg.data.payload.parts[0].body.data, 'base64').toString('utf-8')
            : '(No Content)';

        const emailHeaders = msg.data.payload.headers;
        const subject = emailHeaders.find(h => h.name === 'Subject')?.value || '(No Subject)';
        const from = emailHeaders.find(h => h.name === 'From')?.value || 'Unknown Sender';
        const snippet = msg.data.snippet || '';

        // Construct classification prompt
        const userPrompt = userSettings.prompt || '';
        const prompt = `On a scale of 1 to 10, where 1 is very unlikely and 10 is highly likely, respond with only a single number to rate how much this email seems like a cold email based on factors like generic greeting, promotional language, urgency, and these user-defined flags: ${userPrompt}`;

        console.log(`Classifying email ID: ${messageId} with prompt: ${prompt}`);
        const response = await classifyEmailContent(emailContent, prompt);

        // Parse the classification score
        const classificationScore = parseInt(response.trim(), 10);
        if (isNaN(classificationScore)) {
          console.warn(`Invalid classification score for email ID: ${messageId}`);
          return;
        }

        // Store emails exceeding the threshold
        if (classificationScore >= coldEmailThreshold) {
          blockedEmails.push({
            messageId: messageId,
            subject,
            from,
            snippet,
            content: emailContent,
            classificationScore,
          });
        }
      } catch (error) {
        console.error(`Error processing email ID: ${messageId}`, error.message);
      }
    };

    await Promise.all(emailResponse.data.messages.map((msg) => classifyAndProcessEmail(msg.id)));

    // Save blocked emails with details to the database
    if (blockedEmails.length > 0) {
      await db.collection('BlockedEmails').insertMany(
        blockedEmails.map((email) => ({
          ...email,
          userId: user.sub,
          createdAt: new Date(),
        }))
      );
    }

    // Return response with blocked emails
    return new Response(
      JSON.stringify({ message: 'Blocked emails saved', blockedEmails }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/Rules/ColdEmail/BlockCold:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error', details: error.message }),
      { status: 500 }
    );
  }
}
