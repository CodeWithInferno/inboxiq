import { google } from 'googleapis';
import { getSession } from '@auth0/nextjs-auth0';
import getUserTokens from '@/lib/getUserTokens';

export async function POST(req) {
  try {
    const body = await req.json(); // Parse the request body
    const { to, subject, body: emailBody, userEmail, draftId } = body;

    if (!userEmail || !to || !subject || !emailBody) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get user session
    const session = await getSession(req);
    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ message: 'User not authenticated' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user's tokens from the database
    const userTokens = await getUserTokens(userEmail);
    if (!userTokens || !userTokens.access_token || !userTokens.refresh_token) {
      return new Response(
        JSON.stringify({ message: 'User tokens not found or incomplete' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Initialize OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      access_token: userTokens.access_token,
      refresh_token: userTokens.refresh_token,
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Format email for draft
    const rawEmail = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=UTF-8',
      '',
      emailBody,
    ].join('\n');

    const encodedEmail = Buffer.from(rawEmail)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    if (draftId) {
      // Update existing draft
      const response = await gmail.users.drafts.update({
        userId: 'me',
        id: draftId,
        requestBody: {
          message: {
            raw: encodedEmail,
          },
        },
      });

      return new Response(
        JSON.stringify({
          message: 'Draft updated successfully',
          draftId: response.data.id,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Create new draft
      const response = await gmail.users.drafts.create({
        userId: 'me',
        requestBody: {
          message: {
            raw: encodedEmail,
          },
        },
      });

      return new Response(
        JSON.stringify({
          message: 'Draft saved successfully',
          draftId: response.data.id,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error saving draft to Gmail:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
