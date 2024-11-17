// import { google } from 'googleapis';
// import { getSession } from '@auth0/nextjs-auth0';
// import getUserTokens from '@/lib/getUserTokens';
// import { connectToDatabase } from '@/lib/mongodb';
// import puppeteer from 'puppeteer';

// export async function POST(req) {
//   try {
//     const { emailId } = await req.json();

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

//     // Fetch user tokens securely
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

//     // Fetch email details
//     const email = await gmail.users.messages.get({
//       userId: 'me',
//       id: emailId,
//     });

//     const headers = email.data.payload.headers || [];
//     const body =
//       email.data.payload.parts?.[0]?.body?.data
//         ? Buffer.from(email.data.payload.parts[0].body.data, 'base64').toString('utf-8')
//         : 'No Content';

//     const listUnsubscribeHeader = headers.find(
//       (header) => header.name.toLowerCase() === 'list-unsubscribe'
//     );

//     const unsubscribeLinks = listUnsubscribeHeader
//       ? listUnsubscribeHeader.value.split(',').map((link) => link.trim())
//       : [];

//     const bodyUnsubscribeLinks = (body.match(/https?:\/\/[^\s]*unsubscribe[^\s]*/gi) || []).map(
//       (link) => link.trim()
//     );

//     // Consolidate unsubscribe links
//     const allUnsubscribeLinks = [...unsubscribeLinks, ...bodyUnsubscribeLinks];

//     // Process unsubscribe links
//     const unsubscribeResults = [];
//     for (const link of allUnsubscribeLinks) {
//       try {
//         let processedLink = link;
//         if (processedLink.startsWith('<') && processedLink.endsWith('>')) {
//           processedLink = processedLink.slice(1, -1); // Remove angle brackets
//         }

//         // Handle direct unsubscribe link
//         if (link.startsWith('http')) {
//           const response = await fetch(link, { method: 'GET' });
//           unsubscribeResults.push({
//             link,
//             status: response.ok ? 'Success' : 'Failed',
//           });
//         }
//       } catch (error) {
//         unsubscribeResults.push({
//           link,
//           status: `Error: ${error.message}`,
//         });
//       }
//     }

//     // Handle form-based unsubscribe using Puppeteer
//     for (const link of allUnsubscribeLinks) {
//       if (link.includes('form')) {
//         try {
//           const browser = await puppeteer.launch();
//           const page = await browser.newPage();
//           await page.goto(link);
//           // Assuming a basic form with email input
//           await page.type('input[type="email"]', user.email);
//           await page.click('button[type="submit"]');
//           await browser.close();
//           unsubscribeResults.push({
//             link,
//             status: 'Form submitted',
//           });
//         } catch (error) {
//           unsubscribeResults.push({
//             link,
//             status: `Form error: ${error.message}`,
//           });
//         }
//       }
//     }

//     // Handle reply-to unsubscribe
//     const replyToHeader = headers.find((header) => header.name.toLowerCase() === 'reply-to');
//     if (replyToHeader) {
//       try {
//         const replyMessage = {
//           userId: 'me',
//           requestBody: {
//             raw: Buffer.from(
//               `To: ${replyToHeader.value}\n` +
//                 `Subject: Unsubscribe\n` +
//                 `\n` +
//                 `Please unsubscribe me from this mailing list.\n`
//             ).toString('base64'),
//           },
//         };
//         await gmail.users.messages.send(replyMessage);
//         unsubscribeResults.push({
//           replyTo: replyToHeader.value,
//           status: 'Reply sent',
//         });
//       } catch (error) {
//         unsubscribeResults.push({
//           replyTo: replyToHeader.value,
//           status: `Reply error: ${error.message}`,
//         });
//       }
//     }

//     // Archive the email by removing the "INBOX" label
//     let archiveSuccess = false;
//     try {
//       await gmail.users.messages.modify({
//         userId: 'me',
//         id: emailId,
//         requestBody: {
//           removeLabelIds: ['INBOX'],
//         },
//       });
//       unsubscribeResults.push({
//         emailId,
//         status: 'Email archived successfully',
//       });
//       archiveSuccess = true;
//     } catch (error) {
//       unsubscribeResults.push({
//         emailId,
//         status: `Failed to archive email: ${error.message}`,
//       });
//     }

//     // If successful, remove from database
//     if (archiveSuccess) {
//       await db.collection('Newsletters').updateOne(
//         { userId },
//         { $pull: { results: { emailIds: emailId } } }
//       );

//       // Optionally fetch the updated list
//       const updatedNewsletters = await db
//         .collection('Newsletters')
//         .findOne({ userId }, { projection: { results: 1 } });
      
//       return new Response(
//         JSON.stringify({
//           message: 'Unsubscribe processed and email archived',
//           unsubscribeResults,
//           updatedNewsletters: updatedNewsletters?.results || [],
//         }),
//         { status: 200 }
//       );
//     }

//     return new Response(
//       JSON.stringify({
//         message: 'Unsubscribe processed but not archived',
//         unsubscribeResults,
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error in UnsubscribeMail API:', error);
//     return new Response(
//       JSON.stringify({ message: 'Internal server error', error: error.message }),
//       { status: 500 }
//     );
//   }
// }















import { google } from 'googleapis';
import { getSession } from '@auth0/nextjs-auth0';
import getUserTokens from '@/lib/getUserTokens';
import { connectToDatabase } from '@/lib/mongodb';
import puppeteer from 'puppeteer';

const RATE_LIMIT = 5; // Max requests per user
const TIMEFRAME = 60 * 1000; // Timeframe in milliseconds (1 minute)

export async function POST(req) {
  try {
    const { emailId } = await req.json();

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

    // Implement rate limiting
    const now = Date.now();
    const rateLimitCollection = db.collection('RateLimits');

    // Fetch user's rate limit entry
    const rateLimitEntry = await rateLimitCollection.findOne({ userId });

    if (rateLimitEntry) {
      const recentRequests = rateLimitEntry.requests.filter(
        (timestamp) => now - timestamp < TIMEFRAME
      );

      if (recentRequests.length >= RATE_LIMIT) {
        return new Response(
          JSON.stringify({
            message: 'Rate limit exceeded. Please try again later.',
          }),
          { status: 429 } // HTTP 429 Too Many Requests
        );
      }

      // Update the request timestamps
      await rateLimitCollection.updateOne(
        { userId },
        { $set: { requests: [...recentRequests, now] } }
      );
    } else {
      // Create a new entry for rate limiting
      await rateLimitCollection.insertOne({
        userId,
        requests: [now],
      });
    }

    // Fetch user tokens securely
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

    // Fetch email details
    const email = await gmail.users.messages.get({
      userId: 'me',
      id: emailId,
    });

    const headers = email.data.payload.headers || [];
    const body =
      email.data.payload.parts?.[0]?.body?.data
        ? Buffer.from(email.data.payload.parts[0].body.data, 'base64').toString('utf-8')
        : 'No Content';

    const listUnsubscribeHeader = headers.find(
      (header) => header.name.toLowerCase() === 'list-unsubscribe'
    );

    const unsubscribeLinks = listUnsubscribeHeader
      ? listUnsubscribeHeader.value.split(',').map((link) => link.trim())
      : [];

    const bodyUnsubscribeLinks = (body.match(/https?:\/\/[^\s]*unsubscribe[^\s]*/gi) || []).map(
      (link) => link.trim()
    );

    // Consolidate unsubscribe links
    const allUnsubscribeLinks = [...unsubscribeLinks, ...bodyUnsubscribeLinks];

    // Process unsubscribe links
    const unsubscribeResults = [];
    let unsubscribeCompleted = false; // Track if unsubscribe succeeded

    for (const link of allUnsubscribeLinks) {
      try {
        let processedLink = link.trim();
        if (processedLink.startsWith('<') && processedLink.endsWith('>')) {
          processedLink = processedLink.slice(1, -1); // Remove angle brackets
        }

        if (processedLink.startsWith('http')) {
          // Prioritize direct URL unsubscribe
          const response = await fetch(processedLink, { method: 'GET' });
          if (response.ok) {
            unsubscribeResults.push({ link: processedLink, status: 'Success' });
            unsubscribeCompleted = true; // Mark as completed
            break; // Stop further processing
          }
        }
      } catch (error) {
        unsubscribeResults.push({ link, status: `Error: ${error.message}` });
      }
    }

    // If URL-based unsubscribe fails or is unavailable, handle email-based unsubscribe
    if (!unsubscribeCompleted) {
      const replyToHeader = headers.find((header) => header.name.toLowerCase() === 'reply-to');
      if (replyToHeader) {
        try {
          const replyMessage = {
            userId: 'me',
            requestBody: {
              raw: Buffer.from(
                `To: ${replyToHeader.value}\n` +
                  `Subject: Unsubscribe\n` +
                  `\n` +
                  `Please unsubscribe me from this mailing list.\n`
              ).toString('base64'),
            },
          };
          await gmail.users.messages.send(replyMessage);
          unsubscribeResults.push({ replyTo: replyToHeader.value, status: 'Reply sent' });
        } catch (error) {
          unsubscribeResults.push({ replyTo: replyToHeader.value, status: `Reply error: ${error.message}` });
        }
      }
    }

    // Archive the email by removing the "INBOX" label
    let archiveSuccess = false;
    try {
      await gmail.users.messages.modify({
        userId: 'me',
        id: emailId,
        requestBody: {
          removeLabelIds: ['INBOX'],
        },
      });
      unsubscribeResults.push({
        emailId,
        status: 'Email archived successfully',
      });
      archiveSuccess = true;
    } catch (error) {
      unsubscribeResults.push({
        emailId,
        status: `Failed to archive email: ${error.message}`,
      });
    }

    // If successful, remove from database
    if (archiveSuccess) {
      await db.collection('Newsletters').updateOne(
        { userId },
        { $pull: { results: { emailIds: emailId } } }
      );

      // Optionally fetch the updated list
      const updatedNewsletters = await db
        .collection('Newsletters')
        .findOne({ userId }, { projection: { results: 1 } });

      return new Response(
        JSON.stringify({
          message: 'Unsubscribe processed and email archived',
          unsubscribeResults,
          updatedNewsletters: updatedNewsletters?.results || [],
        }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Unsubscribe processed but not archived',
        unsubscribeResults,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in UnsubscribeMail API:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error', error: error.message }),
      { status: 500 }
    );
  }
}
