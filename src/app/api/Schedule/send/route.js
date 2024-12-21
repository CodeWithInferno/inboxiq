// src/app/api/Schedule/send/route.js
import { google } from 'googleapis';
import { getSession } from '@auth0/nextjs-auth0';
import getUserTokens from '@/lib/getUserTokens';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req) {
  try {
    // Get the user session
    const session = await getSession(req);
    const user = session?.user;

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse the request body to get the email ID or unique identifier
    const { emailId } = await req.json();

    if (!emailId) {
      return new Response(JSON.stringify({ message: 'Email ID is missing' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Connect to the database and fetch the scheduled email
    const db = await connectToDatabase();
    const scheduledEmail = await db.collection('ScheduledEmails').findOne({ _id: emailId });

    if (!scheduledEmail) {
      return new Response(JSON.stringify({ message: 'Scheduled email not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch user tokens from the database
    const userTokens = await getUserTokens(user.email);
    if (!userTokens || !userTokens.access_token) {
      return new Response(JSON.stringify({ message: 'User tokens not found or invalid' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Set up OAuth2 client with the tokens
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      access_token: userTokens.access_token,
      refresh_token: userTokens.refresh_token,
    });

    // Set up Gmail API
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Create the email message
    const emailContent = [
      `To: ${scheduledEmail.to}`,
      scheduledEmail.cc ? `Cc: ${scheduledEmail.cc}` : '',
      scheduledEmail.bcc ? `Bcc: ${scheduledEmail.bcc}` : '',
      `Subject: ${scheduledEmail.subject}`,
      '', // Empty line between headers and body
      scheduledEmail.body,
    ]
      .filter(Boolean)
      .join('\r\n');

    const encodedMessage = Buffer.from(emailContent).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    // Send the email using Gmail API
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log('Email sent successfully:', response.data);

    // Remove the scheduled email from the database after sending
    await db.collection('ScheduledEmails').deleteOne({ _id: emailId });

    return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending scheduled email:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
