import { google } from 'googleapis';
import { connectToDatabase } from '@/lib/database';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const label = searchParams.get('label') || 'INBOX';
    const pageToken = searchParams.get('pageToken') || null;

    if (!email) {
      return new Response(JSON.stringify({ message: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Connect to database
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

    // Fetch threads for the user's label
    const threadResponse = await gmail.users.threads.list({
      userId: 'me',
      labelIds: [label],
      maxResults: 10,
      pageToken: pageToken || undefined,
    });

    const nextPageToken = threadResponse.data.nextPageToken || null;

    if (!threadResponse.data.threads) {
      return new Response(JSON.stringify({ message: 'No threads found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get the details of each thread (individual messages in the thread)
    const threadPromises = threadResponse.data.threads.map(async (thread) => {
      const threadDetails = await gmail.users.threads.get({
        userId: 'me',
        id: thread.id,
      });

      return threadDetails.data;  // Return thread details (all messages in thread)
    });

    const threads = await Promise.all(threadPromises);

    return new Response(
      JSON.stringify({
        threads,
        nextPageToken,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in /api/auth/google/fetchThreads:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
