
// import { google } from 'googleapis';
// import { connectToDatabase } from '@/lib/database';

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const email = searchParams.get('email');
//     const query = searchParams.get('query');  // Search query parameter
//     const label = searchParams.get('label') || 'INBOX';  // Default to 'INBOX' if no label is provided
//     const pageToken = searchParams.get('pageToken') || null;  // Handle pagination

//     if (!email) {
//       return new Response(JSON.stringify({ message: 'Email is required' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     // Connect to the database
//     const db = await connectToDatabase();
//     const user = await db.collection('users').findOne({ email });

//     if (!user || !user.access_token || !user.refresh_token) {
//       return new Response(JSON.stringify({ message: 'User tokens not found' }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     // Set up OAuth2 client with Google API
//     const oauth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET
//     );
//     oauth2Client.setCredentials({
//       access_token: user.access_token,
//       refresh_token: user.refresh_token,
//     });

//     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

//     // Fetch email counts for different categories
//     const categories = ['INBOX', 'CATEGORY_PROMOTIONS', 'CATEGORY_SOCIAL', 'SPAM', 'TRASH'];
//     const labelCounts = {};

//     for (const category of categories) {
//       const labelResponse = await gmail.users.messages.list({
//         userId: 'me',
//         labelIds: [category],
//       });
//       labelCounts[category] = labelResponse.data.resultSizeEstimate || 0;
//     }

//     // Fetch the user's emails for the specified label or search query
//     const emailResponse = await gmail.users.messages.list({
//       userId: 'me',
//       labelIds: query ? undefined : [label],  // Fetch based on category or search query
//       q: query || '',  // Apply search query here
//       maxResults: 10,
//       pageToken: pageToken || undefined,  // Handle pagination
//     });

//     const nextPageToken = emailResponse.data.nextPageToken || null;

//     if (!emailResponse.data.messages) {
//       return new Response(JSON.stringify({ message: 'No emails found' }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     // Helper function to decode Base64 content
//     const decodeBase64 = (str) => {
//       return Buffer.from(str, 'base64').toString('utf-8');
//     };

//     // Function to handle email parts and extract HTML or plain text
//     const getMessageBody = (message) => {
//       let htmlPart = null;
//       let plainPart = null;

//       const findPart = (parts) => {
//         for (const part of parts) {
//           if (part.mimeType === 'text/html') {
//             htmlPart = part;
//           } else if (part.mimeType === 'text/plain') {
//             plainPart = part;
//           } else if (part.parts) {
//             findPart(part.parts);  // Recursively check for parts
//           }
//         }
//       };

//       if (message.payload.parts) {
//         findPart(message.payload.parts);
//       }

//       if (htmlPart && htmlPart.body.data) {
//         return decodeBase64(htmlPart.body.data);  // Return HTML content
//       } else if (plainPart && plainPart.body.data) {
//         return decodeBase64(plainPart.body.data);  // Fallback to plain text
//       }

//       return '';  // Default empty string if no content found
//     };

//     // Fetch and decode each message
//     const messagePromises = emailResponse.data.messages.map(async (message) => {
//       const msg = await gmail.users.messages.get({ userId: 'me', id: message.id });
//       const body = getMessageBody(msg.data);  // Get decoded HTML/plain text body

//       return {
//         id: msg.data.id,
//         subject: msg.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
//         from: msg.data.payload.headers.find((h) => h.name === 'From')?.value,
//         body,  // Now contains decoded content
//         timestamp: new Date(parseInt(msg.data.internalDate)),
//       };
//     });

//     const messages = await Promise.all(messagePromises);

//     return new Response(
//       JSON.stringify({
//         labelCounts,
//         messages,
//         nextPageToken,  // Return nextPageToken for pagination
//       }),
//       {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   } catch (error) {
//     console.error('Error in /api/auth/google/fetchEmails:', error);
//     return new Response(
//       JSON.stringify({ message: 'Internal server error', details: error.message }),
//       {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   }
// }





// import { google } from 'googleapis';
// import { connectToDatabase } from '@/lib/database';

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const email = searchParams.get('email');
//     const query = searchParams.get('query') || '';  // Search query parameter
//     const label = searchParams.get('label') || 'INBOX';  // Default to 'INBOX' if no label is provided
//     const pageToken = searchParams.get('pageToken') || null;  // Handle pagination

//     if (!email) {
//       return new Response(JSON.stringify({ message: 'Email is required' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     // Connect to the database
//     const db = await connectToDatabase();
//     const user = await db.collection('users').findOne({ email });

//     if (!user || !user.access_token || !user.refresh_token) {
//       return new Response(JSON.stringify({ message: 'User tokens not found' }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     // Set up OAuth2 client with Google API
//     const oauth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET
//     );
//     oauth2Client.setCredentials({
//       access_token: user.access_token,
//       refresh_token: user.refresh_token,
//     });

//     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

//     // Fetch email counts for different categories
//     const categories = ['INBOX', 'CATEGORY_PROMOTIONS', 'CATEGORY_SOCIAL', 'SPAM', 'TRASH', 'DRAFT', 'SENT', 'STARRED'];
//     const labelCounts = {};

//     for (const category of categories) {
//       const labelResponse = await gmail.users.messages.list({
//         userId: 'me',
//         labelIds: [category],
//       });
//       labelCounts[category] = labelResponse.data.resultSizeEstimate || 0;
//     }

//     // Fetch the user's emails for the specified label or search query
//     const emailResponse = await gmail.users.messages.list({
//       userId: 'me',
//       labelIds: query ? undefined : [label],  // Fetch based on category or search query
//       q: query || '',  // Apply search query here
//       maxResults: 10,
//       pageToken: pageToken || undefined,  // Handle pagination
//     });

//     const nextPageToken = emailResponse.data.nextPageToken || null;

//     if (!emailResponse.data.messages) {
//       return new Response(JSON.stringify({ message: 'No emails found' }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     // Helper function to decode Base64 content
//     const decodeBase64 = (str) => {
//       return Buffer.from(str, 'base64').toString('utf-8');
//     };

//     // Function to handle email parts and extract HTML or plain text
//     const getMessageBody = (message) => {
//       let htmlPart = null;
//       let plainPart = null;

//       const findPart = (parts) => {
//         for (const part of parts) {
//           if (part.mimeType === 'text/html') {
//             htmlPart = part;
//           } else if (part.mimeType === 'text/plain') {
//             plainPart = part;
//           } else if (part.parts) {
//             findPart(part.parts);  // Recursively check for parts
//           }
//         }
//       };

//       if (message.payload.parts) {
//         findPart(message.payload.parts);
//       }

//       if (htmlPart && htmlPart.body.data) {
//         return decodeBase64(htmlPart.body.data);  // Return HTML content
//       } else if (plainPart && plainPart.body.data) {
//         return decodeBase64(plainPart.body.data);  // Fallback to plain text
//       }

//       return '';  // Default empty string if no content found
//     };

//     // Fetch and decode each message
//     const messagePromises = emailResponse.data.messages.map(async (message) => {
//       const msg = await gmail.users.messages.get({ userId: 'me', id: message.id });
//       const body = getMessageBody(msg.data);  // Get decoded HTML/plain text body

//       return {
//         id: msg.data.id,
//         subject: msg.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
//         from: msg.data.payload.headers.find((h) => h.name === 'From')?.value,
//         snippet: msg.data.snippet,  // Add snippet for previews
//         body,  // Now contains decoded content
//         timestamp: new Date(parseInt(msg.data.internalDate)),
//       };
//     });

//     const messages = await Promise.all(messagePromises);

//     return new Response(
//       JSON.stringify({
//         labelCounts,
//         messages,
//         nextPageToken,  // Return nextPageToken for pagination
//       }),
//       {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   } catch (error) {
//     console.error('Error in /api/auth/google/fetchEmails:', error);
//     return new Response(
//       JSON.stringify({ message: 'Internal server error', details: error.message }),
//       {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   }
// }




import { google } from 'googleapis';
import getUserTokens from '@/lib/getUserTokens';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const label = searchParams.get('label') || 'INBOX';  // Fetch emails from a specific label (default to INBOX)
  const query = searchParams.get('query') || '';  // Handle search queries if provided

  if (!email) {
    return new Response(JSON.stringify({ message: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const userTokens = await getUserTokens(email);

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

    // Fetch emails
    const response = await gmail.users.messages.list({
      userId: 'me',
      labelIds: [label],
      q: query,
      maxResults: 10,
    });

    // Ensure that messages exist in the response
    if (!response.data.messages) {
      return new Response(JSON.stringify({ messages: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const messagePromises = response.data.messages.map(async (message) => {
      const msg = await gmail.users.messages.get({ userId: 'me', id: message.id });

      // Helper function to decode Base64 email content safely
      const decodeBase64 = (data) => {
        if (!data) return '';  // Handle missing data
        return Buffer.from(data, 'base64').toString('utf-8');
      };

      const getMessageBody = (message) => {
        let body = '';
        const parts = message.payload.parts || [message.payload];  // Handle both single-part and multi-part emails

        for (const part of parts) {
          if (part.mimeType === 'text/html' && part.body?.data) {
            body = decodeBase64(part.body.data);
            break;  // Prioritize HTML content
          } else if (part.mimeType === 'text/plain' && part.body?.data) {
            body = decodeBase64(part.body.data);
          }
        }

        return body || 'No content available';
      };

      const body = getMessageBody(msg.data);

      return {
        id: msg.data.id,
        threadId: msg.data.threadId,
        subject: msg.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
        from: msg.data.payload.headers.find((h) => h.name === 'From')?.value,
        body,
        snippet: msg.data.snippet,
        timestamp: new Date(parseInt(msg.data.internalDate)),
      };
    });

    const messages = await Promise.all(messagePromises);
    return new Response(JSON.stringify({ messages }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return new Response(JSON.stringify({ message: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
