import { google } from 'googleapis';
import getUserTokens from '@/lib/getUserTokens';

export async function POST(req) {
  try {
    // Log to verify the request
    console.log("Request received:", req);

    const { to, subject, body, userEmail, threadId, messageId } = await req.json();
    
    // Check if all required fields are provided
    if (!to || !subject || !body || !userEmail || !threadId || !messageId) {
      console.log('Missing required fields:', { to, subject, body, userEmail, threadId, messageId });
      return new Response(JSON.stringify({ message: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch the user tokens
    const userTokens = await getUserTokens(userEmail);

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

    const emailContent = [
      `To: ${to}`,
      `Subject: ${subject}`,
      `In-Reply-To: <${messageId}>`,   // Wrap messageId in angle brackets
      `References: <${messageId}>`,    // Wrap messageId in angle brackets
      'Content-Type: text/html; charset=UTF-8',
      'MIME-Version: 1.0',
      '',
      body,  // The HTML body content
    ].join('\n');
    
    
    // Encode the message to base64 (required by Gmail API)
    const encodedMessage = Buffer.from(emailContent)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    // Send the email via Gmail API, ensuring threadId is used for threading
    const sendResponse = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
        threadId,  // ThreadId to append this reply to the correct thread
      },
    });
    

    // Log the response details
    console.log('Gmail API send response:', sendResponse);

    // Return appropriate response based on success/failure
    if (sendResponse.status === 200) {
      return new Response(JSON.stringify({ message: 'Reply sent successfully!' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      console.log('Gmail API send failed:', sendResponse.data);
      return new Response(JSON.stringify({ message: 'Failed to send reply', details: sendResponse.data }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    // Log the error message and full stack trace
    console.error('Error sending reply:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
