// import { google } from 'googleapis';
// import { getSession } from '@auth0/nextjs-auth0';
// import { connectToDatabase } from '@/lib/mongodb';
// import { classifyEmailContent } from '../../../../utils/openai';
// import getUserTokens from '@/lib/getUserTokens';

// export async function POST(req) {
//   try {
//     // Get the user session
//     const session = await getSession(req);
//     const user = session?.user;

//     if (!user) {
//       return new Response(JSON.stringify({ message: 'User not authenticated' }), { status: 401 });
//     }

//     // Define the redirect URI dynamically based on the environment
//     const redirectUri =
//       process.env.NODE_ENV === 'development'
//         ? 'http://localhost:3000/api/auth/google/callback' // Development redirect URI
//         : 'https://inboxiq-seven.vercel.app/api/auth/google/callback'; // Production redirect URI

//     // Initialize the Google OAuth2 client
//     const oauth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET,
//       redirectUri
//     );

//     // Connect to the database and fetch user settings
//     const db = await connectToDatabase();
//     const userSettings = await db.collection('ColdEmail').findOne({ userId: user.sub });

//     if (!userSettings || !userSettings.isEnabled) {
//       return new Response(
//         JSON.stringify({ message: 'Cold email blocker is disabled' }),
//         { status: 200 }
//       );
//     }

//     // Get user tokens for Gmail API
//     const userTokens = await getUserTokens(user.email);
//     if (!userTokens) {
//       return new Response(JSON.stringify({ message: 'User tokens not found' }), { status: 401 });
//     }

//     // Set OAuth2 client credentials
//     oauth2Client.setCredentials({
//       access_token: userTokens.access_token,
//       refresh_token: userTokens.refresh_token,
//     });

//     // Initialize Gmail API client
//     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

//     // Fetch unread emails
//     const emailResponse = await gmail.users.messages.list({
//       userId: 'me',
//       q: 'is:unread',
//       maxResults: 10,
//     });

//     if (!emailResponse.data.messages || emailResponse.data.messages.length === 0) {
//       return new Response(
//         JSON.stringify({ message: 'No unread emails found' }),
//         { status: 200 }
//       );
//     }

//     // Classify emails and perform the user's action
//     const blockedEmails = [];
//     const coldEmailThreshold = userSettings.threshold || 7;

//     const performAction = async (gmail, messageId, action) => {
//       if (action === 'archive') {
//         // Archive the email
//         await gmail.users.messages.modify({
//           userId: 'me',
//           id: messageId,
//           requestBody: {
//             removeLabelIds: ['INBOX'], // Remove INBOX label to archive
//           },
//         });
//         console.log(`Email archived: ${messageId}`);
//       } else if (action === 'delete') {
//         // Delete the email
//         await gmail.users.messages.delete({
//           userId: 'me',
//           id: messageId,
//         });
//         console.log(`Email deleted: ${messageId}`);
//       }
//     };

//     const classifyAndProcessEmail = async (messageId) => {
//       try {
//         // Fetch individual email details
//         const msg = await gmail.users.messages.get({ userId: 'me', id: messageId });
//         const emailContent =
//           msg.data.payload.parts?.[0]?.body?.data
//             ? Buffer.from(msg.data.payload.parts[0].body.data, 'base64').toString('utf-8')
//             : '(No Content)';

//         // Construct classification prompt
//         const userPrompt = userSettings.prompt || '';
//         const prompt = `On a scale of 1 to 10, where 1 is very unlikely and 10 is highly likely, respond with only a single number to rate how much this email seems like a cold email based on factors like generic greeting, promotional language, urgency, and these user-defined flags: ${userPrompt}`;

//         console.log(`Classifying email ID: ${messageId} with prompt: ${prompt}`);
//         const response = await classifyEmailContent(emailContent, prompt);

//         // Parse the classification score
//         const classificationScore = parseInt(response.trim(), 10);
//         if (isNaN(classificationScore)) {
//           console.warn(`Invalid classification score for email ID: ${messageId}`);
//           return;
//         }

//         // Store emails exceeding the threshold and perform the user-defined action
//         if (classificationScore >= coldEmailThreshold) {
//           const action = userSettings.action; // Retrieve action from user settings
//           await performAction(gmail, messageId, action); // Perform action (archive/delete)
//           blockedEmails.push({
//             messageId: messageId,
//             subject: msg.data.payload.headers.find(h => h.name === 'Subject')?.value || '(No Subject)',
//           });
//         }
//       } catch (error) {
//         console.error(`Error processing email ID: ${messageId}`, error.message);
//       }
//     };

//     await Promise.all(emailResponse.data.messages.map((msg) => classifyAndProcessEmail(msg.id)));

//     // Save blocked emails to the database
//     if (blockedEmails.length > 0) {
//       await db.collection('BlockedEmails').insertMany(
//         blockedEmails.map((email) => ({
//           ...email,
//           userId: user.sub,
//           createdAt: new Date(),
//         }))
//       );
//     }

//     // Return response with blocked emails
//     return new Response(
//       JSON.stringify({ message: 'Blocked emails saved', blockedEmails }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error in POST /api/Rules/ColdEmail/BlockCold:', error);
//     return new Response(
//       JSON.stringify({ message: 'Internal server error', details: error.message }),
//       { status: 500 }
//     );
//   }
// }




































import { google } from 'googleapis';
import { getSession } from '@auth0/nextjs-auth0';
import { connectToDatabase } from '@/lib/mongodb';
import getUserTokens from '@/lib/getUserTokens';

export const POST = async (req) => {
  try {
    const { emails } = await req.json();

    if (!emails || emails.length === 0) {
      console.error('No emails provided to process.');
      return new Response(
        JSON.stringify({ message: 'No emails provided to process' }),
        { status: 400 }
      );
    }

    const session = await getSession(req);
    const user = session?.user;

    if (!user) {
      console.error('User not authenticated.');
      return new Response(JSON.stringify({ message: 'User not authenticated' }), { status: 401 });
    }

    const redirectUri =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api/auth/google/callback'
        : 'https://inboxiq-seven.vercel.app/api/auth/google/callback';

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    const db = await connectToDatabase();

    const userTokens = await getUserTokens(user.email);
    if (!userTokens) {
      console.error('User tokens not found for email:', user.email);
      return new Response(JSON.stringify({ message: 'User tokens not found' }), { status: 401 });
    }

    oauth2Client.setCredentials({
      access_token: userTokens.access_token,
      refresh_token: userTokens.refresh_token,
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Fetch the action from the ColdEmail collection for the current user
    const userSettings = await db.collection('ColdEmail').findOne({ userId: user.sub });
    const action = userSettings?.action;

    if (!action || (action !== 'archive' && action !== 'delete')) {
      console.error('Invalid action provided:', action);
      return new Response(
        JSON.stringify({ message: `Invalid action provided: ${action}` }),
        { status: 400 }
      );
    }

    const performAction = async (gmail, messageId, action) => {
      try {
        if (action === 'archive') {
          await gmail.users.messages.modify({
            userId: 'me',
            id: messageId,
            requestBody: {
              removeLabelIds: ['INBOX'],
            },
          });
          console.log(`Email archived: ${messageId}`);
        } else if (action === 'delete') {
          await gmail.users.messages.delete({
            userId: 'me',
            id: messageId,
          });
          console.log(`Email deleted: ${messageId}`);
        }
      } catch (err) {
        console.error(`Failed to perform action (${action}) on email ID: ${messageId}`, err.message);
        throw new Error(`Action failed for email ID: ${messageId}`);
      }
    };

    for (const emailId of emails) {
      try {
        console.log(`Processing email ID: ${emailId} with action: ${action}`);
        await performAction(gmail, emailId, action);

        const deleteResult = await db.collection('BlockedEmails').deleteOne({ messageId: emailId });
        if (deleteResult.deletedCount === 1) {
          console.log(`Email removed from database: ${emailId}`);
        } else {
          console.warn(`Email not found in database for deletion: ${emailId}`);
        }
      } catch (err) {
        console.error(`Error processing email ID: ${emailId}`, err.message);
      }
    }

    return new Response(
      JSON.stringify({ message: 'Selected emails processed successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/Rules/ColdEmail/ProcessEmails:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error', details: error.message }),
      { status: 500 }
    );
  }
};
