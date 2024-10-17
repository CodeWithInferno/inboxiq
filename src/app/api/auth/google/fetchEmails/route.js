import { google } from 'googleapis';
import { connectToDatabase } from '@/lib/database';

export default async function handler(req, res) {
  try {
    console.log('Received request at /api/google/fetchEmails');
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ email });

    if (!user || !user.access_token || !user.refresh_token) {
      return res.status(404).json({ message: 'User tokens not found' });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: user.access_token,
      refresh_token: user.refresh_token,
    });

    // Refresh access token if needed
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10, // Adjust as needed
    });

    const messagePromises = response.data.messages.map((message) =>
      gmail.users.messages.get({ userId: 'me', id: message.id })
    );

    const messages = await Promise.all(messagePromises);
    const formattedMessages = messages.map((message) => ({
      id: message.data.id,
      subject: message.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
      from: message.data.payload.headers.find((h) => h.name === 'From')?.value,
      body: message.data.snippet,
      timestamp: new Date(parseInt(message.data.internalDate)),
    }));

    console.log('Formatted messages:', formattedMessages);

    return res.status(200).json({ messages: formattedMessages });
  } catch (error) {
    console.error('Error in /api/google/fetchEmails:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
}
