// import { google } from 'googleapis';
// import { getSession } from '@auth0/nextjs-auth0';
// import getUserTokens from '@/lib/getUserTokens';
// import { connectToDatabase } from '@/lib/mongodb';
// import puppeteer from 'puppeteer';

// const RATE_LIMIT = 5; // Max requests per user
// const TIMEFRAME = 60 * 1000; // Timeframe in milliseconds (1 minute)

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

//     // Implement rate limiting
//     const now = Date.now();
//     const rateLimitCollection = db.collection('RateLimits');

//     // Fetch user's rate limit entry
//     const rateLimitEntry = await rateLimitCollection.findOne({ userId });

//     if (rateLimitEntry) {
//       const recentRequests = rateLimitEntry.requests.filter(
//         (timestamp) => now - timestamp < TIMEFRAME
//       );

//       if (recentRequests.length >= RATE_LIMIT) {
//         return new Response(
//           JSON.stringify({
//             message: 'Rate limit exceeded. Please try again later.',
//           }),
//           { status: 429 } // HTTP 429 Too Many Requests
//         );
//       }

//       // Update the request timestamps
//       await rateLimitCollection.updateOne(
//         { userId },
//         { $set: { requests: [...recentRequests, now] } }
//       );
//     } else {
//       // Create a new entry for rate limiting
//       await rateLimitCollection.insertOne({
//         userId,
//         requests: [now],
//       });
//     }

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
//     let unsubscribeCompleted = false; // Track if unsubscribe succeeded

//     for (const link of allUnsubscribeLinks) {
//       try {
//         let processedLink = link.trim();
//         if (processedLink.startsWith('<') && processedLink.endsWith('>')) {
//           processedLink = processedLink.slice(1, -1); // Remove angle brackets
//         }

//         if (processedLink.startsWith('http')) {
//           // Prioritize direct URL unsubscribe
//           const response = await fetch(processedLink, { method: 'GET' });
//           if (response.ok) {
//             unsubscribeResults.push({ link: processedLink, status: 'Success' });
//             unsubscribeCompleted = true; // Mark as completed
//             break; // Stop further processing
//           }
//         }
//       } catch (error) {
//         unsubscribeResults.push({ link, status: `Error: ${error.message}` });
//       }
//     }

//     // If URL-based unsubscribe fails or is unavailable, handle email-based unsubscribe
//     if (!unsubscribeCompleted) {
//       const replyToHeader = headers.find((header) => header.name.toLowerCase() === 'reply-to');
//       if (replyToHeader) {
//         try {
//           const replyMessage = {
//             userId: 'me',
//             requestBody: {
//               raw: Buffer.from(
//                 `To: ${replyToHeader.value}\n` +
//                   `Subject: Unsubscribe\n` +
//                   `\n` +
//                   `Please unsubscribe me from this mailing list.\n`
//               ).toString('base64'),
//             },
//           };
//           await gmail.users.messages.send(replyMessage);
//           unsubscribeResults.push({ replyTo: replyToHeader.value, status: 'Reply sent' });
//         } catch (error) {
//           unsubscribeResults.push({ replyTo: replyToHeader.value, status: `Reply error: ${error.message}` });
//         }
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












// import { google } from 'googleapis';
// import { getSession } from '@auth0/nextjs-auth0';
// import getUserTokens from '@/lib/getUserTokens';

// // Retry mechanism for handling server failures
// async function retryFetch(url, retries = 3, delay = 5000) {
//   for (let i = 0; i < retries; i++) {
//     try {
//       const response = await fetch(url, { method: 'GET' });
//       if (response.ok) {
//         return response; // Success
//       }
//     } catch (error) {
//       console.error(`Retry ${i + 1} failed for URL: ${url}`, error.message);
//     }
//     await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
//   }
//   throw new Error(`Failed to fetch URL after ${retries} retries: ${url}`);
// }

// function decodeBase64(content) {
//   try {
//     return Buffer.from(content, 'base64').toString('utf-8');
//   } catch (error) {
//     console.error("Error decoding Base64 content:", error.message);
//     return '';
//   }
// }

// async function sendUnsubscribeEmail(gmail, senderEmail) {
//   if (!senderEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
//     console.log("Invalid sender email format:", senderEmail);
//     return { status: 'Failed', error: 'Invalid sender email format' };
//   }

//   if (senderEmail.includes('privaterelay.appleid.com')) {
//     console.log("Apple Private Relay email detected:", senderEmail);
//     return { status: 'Failed', error: 'Cannot send to Apple Private Relay addresses' };
//   }

//   try {
//     const message = `
//       To: ${senderEmail}
//       Subject: Unsubscribe Request
//       Content-Type: text/plain; charset="UTF-8"
      
//       Please remove me from your mailing list. Thank you.
//     `.trim();

//     const encodedMessage = Buffer.from(message)
//       .toString('base64')
//       .replace(/\+/g, '-')
//       .replace(/\//g, '_')
//       .replace(/=+$/, '');

//     const result = await gmail.users.messages.send({
//       userId: 'me',
//       requestBody: {
//         raw: encodedMessage,
//       },
//     });

//     console.log(`Unsubscribe email sent to ${senderEmail}`);
//     return { status: 'Success', email: senderEmail };
//   } catch (error) {
//     console.error(`Failed to send unsubscribe email to ${senderEmail}`, error.message);
//     return { status: 'Failed', email: senderEmail, error: error.message };
//   }
// }

// async function handleEmailAction(gmail, emailId, action) {
//   switch (action) {
//     case 'markAsRead':
//       await gmail.users.messages.modify({
//         userId: 'me',
//         id: emailId,
//         requestBody: {
//           removeLabelIds: ['UNREAD'], // Remove UNREAD label to mark as read
//         },
//       });
//       console.log("Email marked as read:", emailId);
//       return { status: 'Success', action };
//     case 'delete':
//       await gmail.users.messages.delete({
//         userId: 'me',
//         id: emailId,
//       });
//       console.log("Email deleted:", emailId);
//       return { status: 'Success', action };
//     case 'archive':
//       await gmail.users.messages.modify({
//         userId: 'me',
//         id: emailId,
//         requestBody: {
//           removeLabelIds: ['INBOX'], // Remove INBOX label to archive
//         },
//       });
//       console.log("Email archived:", emailId);
//       return { status: 'Success', action };
//     default:
//       console.log("Invalid action selected:", action);
//       return { status: 'Failed', error: 'Invalid action' };
//   }
// }

// export async function POST(req) {
//   try {
//     console.log("Request received for UnsubscribeMail API");

//     const { emailId, action } = await req.json();
//     console.log("Email ID received:", emailId);
//     console.log("Action selected:", action);

//     // Authenticate user session
//     const session = await getSession(req);
//     const user = session?.user;

//     if (!user) {
//       console.log("User not authenticated");
//       return new Response(
//         JSON.stringify({ message: 'User not authenticated' }),
//         { status: 401 }
//       );
//     }

//     console.log("Authenticated user ID:", user.sub);

//     // Get user tokens
//     const userTokens = await getUserTokens(user.email);
//     if (!userTokens) {
//       console.log("User tokens not found for:", user.email);
//       return new Response(
//         JSON.stringify({ message: 'User tokens not found' }),
//         { status: 401 }
//       );
//     }

//     // Initialize OAuth2 client
//     const oauth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET,
//       process.env.REDIRECT_URI
//     );

//     oauth2Client.setCredentials({
//       access_token: userTokens.access_token,
//       refresh_token: userTokens.refresh_token,
//     });

//     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

//     // Fetch email details
//     const email = await gmail.users.messages.get({
//       userId: 'me',
//       id: emailId,
//     });

//     console.log("Fetched email details successfully");

//     const headers = email.data.payload.headers || [];
//     const senderEmailHeader = headers.find(
//       (header) => header.name.toLowerCase() === 'from'
//     )?.value;
//     const senderEmail = senderEmailHeader
//       ? senderEmailHeader.match(/<([^>]+)>/)?.[1] || senderEmailHeader
//       : null;

//     const listUnsubscribeHeader = headers.find(
//       (header) => header.name.toLowerCase() === 'list-unsubscribe'
//     );

//     let unsubscribeLinks = [];
//     if (listUnsubscribeHeader) {
//       unsubscribeLinks = listUnsubscribeHeader.value
//         .split(',')
//         .map((link) => link.trim());
//       console.log("Extracted unsubscribe links from header:", unsubscribeLinks);
//     }

//     if (!unsubscribeLinks.length) {
//       console.log("No List-Unsubscribe header found, searching email body for links...");

//       const parts = email.data.payload.parts || [];
//       let emailBody = '';

//       if (email.data.payload.body?.data) {
//         emailBody = decodeBase64(email.data.payload.body.data);
//       } else {
//         for (const part of parts) {
//           if (part.body?.data) {
//             emailBody += decodeBase64(part.body.data);
//           }
//         }
//       }

//       const unsubscribeLinkRegex = /(https?:\/\/[^\s]+unsubscribe[^\s]*)/gi;
//       unsubscribeLinks = [...emailBody.matchAll(unsubscribeLinkRegex)].map(
//         (match) => match[0]
//       );

//       console.log("Extracted unsubscribe links from email body:", unsubscribeLinks);
//     }

//     if (!unsubscribeLinks.length) {
//       console.log("No unsubscribe links found. Attempting fallback to send email.");

//       if (!senderEmail) {
//         console.log("No sender email found. Cannot send fallback email.");
//         return new Response(
//           JSON.stringify({ message: 'No unsubscribe links or sender email found' }),
//           { status: 400 }
//         );
//       }

//       const emailResult = await sendUnsubscribeEmail(gmail, senderEmail);
//       return new Response(
//         JSON.stringify({
//           message: 'Fallback email sent to request unsubscription',
//           result: emailResult,
//         }),
//         { status: emailResult.status === 'Success' ? 200 : 500 }
//       );
//     }

//     const unsubscribeResults = [];
//     let success = false;

//     for (let link of unsubscribeLinks) {
//       if (link.startsWith('<') && link.endsWith('>')) {
//         link = link.slice(1, -1); // Remove angle brackets
//       }

//       try {
//         if (link.startsWith('http')) {
//           console.log("Processing HTTP link:", link);
//           const response = await retryFetch(link); // Retry mechanism for HTTP requests
//           if (response.ok) {
//             console.log("Unsubscribed successfully via HTTP link:", link);
//             unsubscribeResults.push({ link, status: 'Success' });
//             success = true;
//             break;
//           }
//         }
//       } catch (error) {
//         console.error("Error processing link:", link, error.message);
//         unsubscribeResults.push({ link, status: `Error: ${error.message}` });
//       }
//     }

//     if (!success) {
//       console.log("Unsubscription failed for all links");
//       return new Response(
//         JSON.stringify({ message: 'Failed to unsubscribe', results: unsubscribeResults }),
//         { status: 500 }
//       );
//     }

//     console.log("Unsubscription process completed successfully");

//     // Handle the user's selected action on the email
//     if (action) {
//       const actionResult = await handleEmailAction(gmail, emailId, action);
//       return new Response(
//         JSON.stringify({
//           message: 'Unsubscription process completed, and action performed',
//           unsubscribeResults,
//           actionResult,
//         }),
//         { status: actionResult.status === 'Success' ? 200 : 500 }
//       );
//     }

//     return new Response(
//       JSON.stringify({
//         message: 'Unsubscription process completed',
//         results: unsubscribeResults,
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Unhandled error in UnsubscribeMail API:", error.message);
//     return new Response(
//       JSON.stringify({ message: 'Internal server error', error: error.message }),
//       { status: 500 }
//     );
//   }
// }














import { google } from 'googleapis';
import { getSession } from '@auth0/nextjs-auth0';
import getUserTokens from '@/lib/getUserTokens';

// Retry mechanism for handling server failures
async function retryFetch(url, retries = 3, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, { method: 'GET' });
      if (response.ok) {
        return response; // Success
      }
    } catch (error) {
      console.error(`Retry ${i + 1} failed for URL: ${url}`, error.message);
    }
    await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
  }
  throw new Error(`Failed to fetch URL after ${retries} retries: ${url}`);
}

function decodeBase64(content) {
  try {
    return Buffer.from(content, 'base64').toString('utf-8');
  } catch (error) {
    console.error("Error decoding Base64 content:", error.message);
    return '';
  }
}

async function sendUnsubscribeEmail(gmail, senderEmail) {
  if (!senderEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
    console.log("Invalid sender email format:", senderEmail);
    return { status: 'Failed', error: 'Invalid sender email format' };
  }

  if (senderEmail.includes('privaterelay.appleid.com')) {
    console.log("Apple Private Relay email detected:", senderEmail);
    return { status: 'Failed', error: 'Cannot send to Apple Private Relay addresses' };
  }

  try {
    const message = `
      To: ${senderEmail}
      Subject: Unsubscribe Request
      Content-Type: text/plain; charset="UTF-8"
      
      Please remove me from your mailing list. Thank you.
    `.trim();

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log(`Unsubscribe email sent to ${senderEmail}`);
    return { status: 'Success', email: senderEmail };
  } catch (error) {
    console.error(`Failed to send unsubscribe email to ${senderEmail}`, error.message);
    return { status: 'Failed', email: senderEmail, error: error.message };
  }
}

async function handleEmailAction(gmail, emailId, action) {
  switch (action) {
    case 'markAsRead':
      await gmail.users.messages.modify({
        userId: 'me',
        id: emailId,
        requestBody: {
          removeLabelIds: ['UNREAD'], // Remove UNREAD label to mark as read
        },
      });
      console.log("Email marked as read:", emailId);
      return { status: 'Success', action };
    case 'delete':
      await gmail.users.messages.delete({
        userId: 'me',
        id: emailId,
      });
      console.log("Email deleted:", emailId);
      return { status: 'Success', action };
    case 'archive':
      await gmail.users.messages.modify({
        userId: 'me',
        id: emailId,
        requestBody: {
          removeLabelIds: ['INBOX'], // Remove INBOX label to archive
        },
      });
      console.log("Email archived:", emailId);
      return { status: 'Success', action };
    default:
      console.log("Invalid action selected:", action);
      return { status: 'Failed', error: 'Invalid action' };
  }
}

export async function POST(req) {
  try {
    console.log("Request received for UnsubscribeMail API");

    const { emailId, action } = await req.json();
    console.log("Email ID received:", emailId);
    console.log("Action selected:", action);

    const session = await getSession(req);
    const user = session?.user;

    if (!user) {
      console.log("User not authenticated");
      return new Response(
        JSON.stringify({ message: 'User not authenticated' }),
        { status: 401 }
      );
    }

    console.log("Authenticated user ID:", user.sub);

    const userTokens = await getUserTokens(user.email);
    if (!userTokens) {
      console.log("User tokens not found for:", user.email);
      return new Response(
        JSON.stringify({ message: 'User tokens not found' }),
        { status: 401 }
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: userTokens.access_token,
      refresh_token: userTokens.refresh_token,
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const email = await gmail.users.messages.get({
      userId: 'me',
      id: emailId,
    });

    console.log("Fetched email details successfully");

    const headers = email.data.payload.headers || [];
    const senderEmailHeader = headers.find(
      (header) => header.name.toLowerCase() === 'from'
    )?.value;
    const senderEmail = senderEmailHeader
      ? senderEmailHeader.match(/<([^>]+)>/)?.[1] || senderEmailHeader
      : null;

    const listUnsubscribeHeader = headers.find(
      (header) => header.name.toLowerCase() === 'list-unsubscribe'
    );

    let unsubscribeLinks = [];
    if (listUnsubscribeHeader) {
      unsubscribeLinks = listUnsubscribeHeader.value
        .split(',')
        .map((link) => link.trim());
      console.log("Extracted unsubscribe links from header:", unsubscribeLinks);
    }

    if (!unsubscribeLinks.length) {
      const parts = email.data.payload.parts || [];
      let emailBody = '';

      if (email.data.payload.body?.data) {
        emailBody = decodeBase64(email.data.payload.body.data);
      } else {
        for (const part of parts) {
          if (part.body?.data) {
            emailBody += decodeBase64(part.body.data);
          }
        }
      }

      const unsubscribeLinkRegex = /(https?:\/\/[^\s]+unsubscribe[^\s]*)/gi;
      unsubscribeLinks = [...emailBody.matchAll(unsubscribeLinkRegex)].map(
        (match) => match[0]
      );

      console.log("Extracted unsubscribe links from email body:", unsubscribeLinks);
    }

    let success = false;
    for (let link of unsubscribeLinks) {
      if (link.startsWith('<') && link.endsWith('>')) {
        link = link.slice(1, -1);
      }
      try {
        if (link.startsWith('http')) {
          const response = await retryFetch(link);
          if (response.ok) {
            console.log("Unsubscribed successfully via HTTP link:", link);
            success = true;
            break;
          }
        }
      } catch (error) {
        console.error("Error processing link:", link, error.message);
      }
    }

    if (!success) {
      console.log("Unsubscription failed for all links");
      return new Response(
        JSON.stringify({ message: 'Failed to unsubscribe' }),
        { status: 500 }
      );
    }

    const actionResult = await handleEmailAction(gmail, emailId, action);

    return new Response(
      JSON.stringify({
        message: 'Unsubscription process completed and action performed',
        actionResult,
      }),
      { status: actionResult.status === 'Success' ? 200 : 500 }
    );
  } catch (error) {
    console.error("Unhandled error in UnsubscribeMail API:", error.message);
    return new Response(
      JSON.stringify({ message: 'Internal server error', error: error.message }),
      { status: 500 }
    );
  }
}
