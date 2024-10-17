// // import { google } from 'googleapis';
// // import { connectToDatabase } from '@/lib/database';

// // export default async function handler(req, res) {
// //   // Only allow GET requests
// //   if (req.method === 'GET') {
// //     try {
// //       console.log('Received GET request at /api/auth/google/fetchEmails');
      
// //       // Extract email from query parameters
// //       const { email } = req.query;

// //       // Return error if email is not provided
// //       if (!email) {
// //         return res.status(400).json({ message: 'Email is required' });
// //       }

// //       // Connect to the database
// //       const db = await connectToDatabase();
// //       const user = await db.collection('users').findOne({ email });

// //       // Return error if the user or tokens are not found
// //       if (!user || !user.access_token || !user.refresh_token) {
// //         return res.status(404).json({ message: 'User tokens not found' });
// //       }

// //       // Setup OAuth2 client using the user's tokens
// //       const oauth2Client = new google.auth.OAuth2(
// //         process.env.GOOGLE_CLIENT_ID,
// //         process.env.GOOGLE_CLIENT_SECRET
// //       );

// //       // Set the credentials for the OAuth2 client
// //       oauth2Client.setCredentials({
// //         access_token: user.access_token,
// //         refresh_token: user.refresh_token,
// //       });

// //       // Create a Gmail instance with the authenticated client
// //       const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// //       // Fetch a list of the user's emails (maximum 10 emails)
// //       const response = await gmail.users.messages.list({
// //         userId: 'me',
// //         maxResults: 10, // Adjust the number of emails as necessary
// //       });

// //       // If no emails are found, return a 404 error
// //       if (!response.data.messages) {
// //         return res.status(404).json({ message: 'No emails found' });
// //       }

// //       // Get the detailed information for each email
// //       const messagePromises = response.data.messages.map((message) =>
// //         gmail.users.messages.get({ userId: 'me', id: message.id })
// //       );
// //       const messages = await Promise.all(messagePromises);

// //       // Format the fetched messages
// //       const formattedMessages = messages.map((message) => ({
// //         id: message.data.id,
// //         subject: message.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
// //         from: message.data.payload.headers.find((h) => h.name === 'From')?.value,
// //         body: message.data.snippet,
// //         timestamp: new Date(parseInt(message.data.internalDate)),
// //       }));

// //       // Log the formatted messages to the console for debugging
// //       console.log('Formatted messages:', formattedMessages);

// //       // Return the list of formatted emails
// //       return res.status(200).json({ messages: formattedMessages });

// //     } catch (error) {
// //       // Catch and log any errors, then return a 500 response
// //       console.error('Error in /api/auth/google/fetchEmails:', error);
// //       return res.status(500).json({ message: 'Internal server error', details: error.message });
// //     }
// //   } else {
// //     // Return a 405 error for methods other than GET
// //     res.setHeader('Allow', ['GET']);
// //     return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
// //   }
// // }





// import { google } from 'googleapis';
// import { connectToDatabase } from '@/lib/mongodb';

// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     try {
//       const { email } = req.query;

//       if (!email) {
//         return res.status(400).json({ message: 'Email is required' });
//       }

//       const db = await connectToDatabase();
//       const user = await db.collection('users').findOne({ email });

//       if (!user || !user.access_token || !user.refresh_token) {
//         return res.status(404).json({ message: 'User tokens not found' });
//       }

//       const oauth2Client = new google.auth.OAuth2(
//         process.env.GOOGLE_CLIENT_ID,
//         process.env.GOOGLE_CLIENT_SECRET
//       );

//       oauth2Client.setCredentials({
//         access_token: user.access_token,
//         refresh_token: user.refresh_token,
//       });

//       // Refresh the access token if expired
//       const { credentials } = await oauth2Client.refreshAccessToken();
//       oauth2Client.setCredentials(credentials);

//       const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

//       const response = await gmail.users.messages.list({ userId: 'me', maxResults: 10 });

//       if (!response.data.messages) {
//         return res.status(404).json({ message: 'No emails found' });
//       }

//       const messagePromises = response.data.messages.map((message) =>
//         gmail.users.messages.get({ userId: 'me', id: message.id })
//       );

//       const messages = await Promise.all(messagePromises);

//       const formattedMessages = messages.map((message) => ({
//         id: message.data.id,
//         subject: message.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
//         from: message.data.payload.headers.find((h) => h.name === 'From')?.value,
//         body: message.data.snippet,
//         timestamp: new Date(parseInt(message.data.internalDate)),
//       }));

//       return res.status(200).json({ messages: formattedMessages });
//     } catch (error) {
//       console.error('Error in /api/auth/google/fetchEmails:', error);
//       return res.status(500).json({ message: 'Internal server error', details: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['GET']);
//     return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
//   }
// }









// src/app/api/auth/google/fetchEmails/route.js
import { google } from 'googleapis';
import { connectToDatabase } from '@/lib/database';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return new Response(JSON.stringify({ message: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Connect to the database
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ email });

    if (!user || !user.access_token || !user.refresh_token) {
      return new Response(JSON.stringify({ message: 'User tokens not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Set up OAuth2 client with Google API
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: user.access_token,
      refresh_token: user.refresh_token,
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Fetch the user's emails (maximum 10)
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10,
    });

    if (!response.data.messages) {
      return new Response(JSON.stringify({ message: 'No emails found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Helper function to decode Base64 content
    const decodeBase64 = (str) => {
      return Buffer.from(str, 'base64').toString('utf-8');
    };

    // Function to handle email parts and extract HTML or plain text
    const getMessageBody = (message) => {
      let htmlPart = null;
      let plainPart = null;

      const findPart = (parts) => {
        for (const part of parts) {
          if (part.mimeType === 'text/html') {
            htmlPart = part;
          } else if (part.mimeType === 'text/plain') {
            plainPart = part;
          } else if (part.parts) {
            findPart(part.parts); // Recursive search in nested parts
          }
        }
      };

      if (message.payload.parts) {
        findPart(message.payload.parts);
      }

      if (htmlPart && htmlPart.body.data) {
        return decodeBase64(htmlPart.body.data); // Return HTML content
      } else if (plainPart && plainPart.body.data) {
        return decodeBase64(plainPart.body.data); // Fallback to plain text
      }

      return ''; // Default empty string if no content found
    };

    // Fetch and decode each message
    const messagePromises = response.data.messages.map(async (message) => {
      const msg = await gmail.users.messages.get({ userId: 'me', id: message.id });
      const body = getMessageBody(msg.data); // Get decoded HTML/plain text body

      return {
        id: msg.data.id,
        subject: msg.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
        from: msg.data.payload.headers.find((h) => h.name === 'From')?.value,
        body, // Now contains decoded content
        timestamp: new Date(parseInt(msg.data.internalDate)),
      };
    });

    const messages = await Promise.all(messagePromises);

    return new Response(JSON.stringify({ messages }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in /api/auth/google/fetchEmails:', error);
    return new Response(JSON.stringify({ message: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
