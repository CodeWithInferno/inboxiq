import { google } from 'googleapis';
import { connectToDatabase } from '@/lib/database';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const threadId = searchParams.get('threadId'); // Ensure threadId is being passed!

    if (!email || !threadId) {
      return new Response(JSON.stringify({ message: 'Email and Thread ID are required' }), {
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

    // Fetch the thread details by threadId
    const threadResponse = await gmail.users.threads.get({
      userId: 'me',
      id: threadId,  // Use the threadId to get the details of this thread
    });

    if (!threadResponse.data) {
      return new Response(JSON.stringify({ message: 'Thread not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const threadDetails = threadResponse.data.messages.map((msg) => {
      const subject = msg.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)';
      const from = msg.payload.headers.find((h) => h.name === 'From')?.value;
      const body = msg.payload.parts?.find(part => part.mimeType === 'text/html')?.body?.data;
      const decodedBody = body ? Buffer.from(body, 'base64').toString('utf-8') : '';

      return {
        id: msg.id,
        subject,
        from,
        body: decodedBody,
        timestamp: new Date(parseInt(msg.internalDate)),
      };
    });

    return new Response(
      JSON.stringify({
        threadId: threadResponse.data.id,
        messages: threadDetails,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in /api/google/fetchThreads:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
