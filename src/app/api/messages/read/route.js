import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { connectToDatabase } from '@/lib/database';

export async function PATCH(req) {
  try {
    // Parsing the request body
    const { gmailMessageId, isRead, userEmail } = await req.json();

    // Log the incoming request to see if the data is being passed correctly
    console.log('PATCH Request received with data:', { gmailMessageId, isRead, userEmail });

    // Connect to MongoDB
    const db = await connectToDatabase();
    if (!db) {
      console.error('Database connection failed');
      return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
    }

    // Fetch user tokens from the database
    const userTokens = await db.collection('users').findOne({ email: userEmail });
    if (!userTokens) {
      console.error('User tokens not found for:', userEmail);
      return NextResponse.json({ message: 'User tokens not found' }, { status: 404 });
    }

    console.log('User tokens fetched:', userTokens);

    // Set up OAuth2 client for Google API
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: userTokens.access_token,
      refresh_token: userTokens.refresh_token,
    });

    // Set up Gmail API client
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Attempt to modify the message's read/unread status
    const modifyResponse = await gmail.users.messages.modify({
      userId: 'me',
      id: gmailMessageId,
      requestBody: {
        addLabelIds: isRead ? [] : ['UNREAD'], // Add 'UNREAD' label if unread
        removeLabelIds: isRead ? ['UNREAD'] : [], // Remove 'UNREAD' label if read
      },
    });

    console.log('Gmail API modify response:', modifyResponse);

    return NextResponse.json({ message: 'Email read status updated in Gmail successfully' });
  } catch (error) {
    console.error('Error updating read status in Gmail:', error);
    return NextResponse.json(
      { message: 'Failed to update read status in Gmail', error: error.message },
      { status: 500 }
    );
  }
}
