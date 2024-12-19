import { google } from 'googleapis';
import { getSession } from '@auth0/nextjs-auth0';
import getUserTokens from '@/lib/getUserTokens';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return new Response(JSON.stringify({ message: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const session = await getSession(req);
    const user = session?.user;

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userTokens = await getUserTokens(email);
    if (!userTokens || !userTokens.access_token || !userTokens.refresh_token) {
      return new Response(JSON.stringify({ message: 'User tokens not found or incomplete' }), {
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

    const draftsResponse = await gmail.users.drafts.list({
      userId: 'me',
      maxResults: 10,
    });

    if (!draftsResponse.data.drafts) {
      return new Response(JSON.stringify({ drafts: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const drafts = await Promise.all(
      draftsResponse.data.drafts.map(async (draft) => {
        const draftData = await gmail.users.drafts.get({
          userId: 'me',
          id: draft.id,
        });

        const decodeBase64 = (data) => Buffer.from(data || '', 'base64').toString('utf-8');

        const getDraftBody = (msg) => {
          let body = '';
          const parts = msg.payload.parts || [msg.payload];
          for (const part of parts) {
            if (part.mimeType === 'text/html' && part.body?.data) {
              body = decodeBase64(part.body.data);
              break;
            } else if (part.mimeType === 'text/plain' && part.body?.data) {
              body = decodeBase64(part.body.data);
            }
          }
          return body || 'No content available';
        };

        const body = getDraftBody(draftData.data.message);

        return {
          id: draftData.data.id,
          subject: draftData.data.message.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
          to: draftData.data.message.payload.headers.find((h) => h.name === 'To')?.value || '',
          body,
          snippet: draftData.data.message.snippet,
          timestamp: new Date(parseInt(draftData.data.message.internalDate || Date.now())),
        };
      })
    );

    return new Response(JSON.stringify({ drafts }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching drafts:', error);
    return new Response(
      JSON.stringify({
        message: 'Internal server error',
        details: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
