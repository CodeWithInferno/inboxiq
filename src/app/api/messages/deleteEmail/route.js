import { google } from 'googleapis';
import { connectToDatabase } from '@/lib/database';

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const messageId = searchParams.get('id');

    if (!email || !messageId) {
      return new Response(JSON.stringify({ message: 'Email and message ID are required' }), {
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

    // Call the Gmail API to delete the message
    await gmail.users.messages.delete({
      userId: 'me',
      id: messageId,
    });

    return new Response(
      JSON.stringify({ message: 'Email deleted successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error deleting email:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
