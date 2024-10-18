import { google } from 'googleapis';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
  try {
    const { messageId, gmailMessageId, userEmail } = await req.json();

    // Fetch user's tokens from MongoDB
    const client = await clientPromise;
    const db = client.db('mySaaSApp');
    const userTokens = await db.collection('users').findOne({ email: userEmail });

    if (!userTokens) {
      return NextResponse.json({ message: 'User tokens not found' }, { status: 404 });
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

    // Delete the email from Gmail
    await gmail.users.messages.delete({
      userId: 'me',
      id: gmailMessageId, // Gmail-specific message ID
    });

    // Delete from MongoDB
    const result = await db.collection('messages').deleteOne({
      _id: new ObjectId(messageId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Message not found in MongoDB' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Message deleted successfully from Gmail and MongoDB' });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ message: 'Failed to delete message', error: error.message }, { status: 500 });
  }
}
