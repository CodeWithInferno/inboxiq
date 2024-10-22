import { google } from 'googleapis';
import getUserTokens from '@/lib/getUserTokens';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const threadId = searchParams.get('threadId');

  if (!email || !threadId) {
    return new Response(JSON.stringify({ message: 'Email and threadId are required' }), {
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

    // Fetch the thread using the Gmail API
    const response = await gmail.users.threads.get({
      userId: 'me',
      id: threadId, // Use the threadId parameter from the URL
    });

    if (!response.data || !response.data.messages) {
      return new Response(JSON.stringify({ message: 'No thread messages found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Process each message in the thread
    const threadMessages = response.data.messages.map((message) => {
      const decodeBase64 = (data) => {
        return Buffer.from(data, 'base64').toString('utf-8');
      };

      const getMessageBody = (message) => {
        let body = '';
        const parts = message.payload.parts || [message.payload];

        for (const part of parts) {
          if (part.mimeType === 'text/html' && part.body?.data) {
            body = decodeBase64(part.body.data);
            break;  // Prefer HTML content if available
          } else if (part.mimeType === 'text/plain' && part.body?.data) {
            body = decodeBase64(part.body.data);
          }
        }

        return body;
      };

      return {
        id: message.id,
        threadId: message.threadId,
        subject: message.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
        from: message.payload.headers.find((h) => h.name === 'From')?.value,
        body: getMessageBody(message),
        snippet: message.snippet,
        timestamp: new Date(parseInt(message.internalDate)),
      };
    });

    return new Response(JSON.stringify({ messages: threadMessages }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching thread:', error);
    return new Response(JSON.stringify({ message: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
