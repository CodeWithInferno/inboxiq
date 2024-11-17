import { google } from 'googleapis';
import { getSession } from '@auth0/nextjs-auth0';
import { connectToDatabase } from '@/lib/mongodb';
import { classifyEmailContent } from '../../../../utils/openai';
import { archiveEmail, deleteEmail } from '../../../../utils/emailActions';
import getUserTokens from '@/lib/getUserTokens';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const label = searchParams.get('label');

  if (!email) {
    return new Response(JSON.stringify({ message: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const getGmailLabelAndQuery = (label) => {
    switch (label.toLowerCase()) {
      case 'inbox':
        return { labelId: 'INBOX', query: 'category:primary' };
      case 'promotions':
        return { labelId: 'CATEGORY_PROMOTIONS', query: 'category:promotions' };
      case 'social':
        return { labelId: 'CATEGORY_SOCIAL', query: 'category:social' };
      case 'updates':
        return { labelId: 'CATEGORY_UPDATES', query: 'category:updates' };
      case 'spam':
        return { labelId: 'SPAM', query: '' };
      case 'trash':
        return { labelId: 'TRASH', query: '' };
      case 'sent':
        return { labelId: 'SENT', query: '' };
      case 'drafts':
        return { labelId: 'DRAFT', query: '' };
      case 'starred':
        return { labelId: 'STARRED', query: '' };
      default:
        return { labelId: 'INBOX', query: '' }; // Empty query for default
    }
  };
  

  try {
    console.log("GET request received at /api/auth/google/fetchEmails");

    const session = await getSession(req);
    const user = session?.user;

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`Fetching tokens for email: ${email} with userId: ${user.sub}`);

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

    const { labelId, query } = getGmailLabelAndQuery(label);

    console.log(`Fetching emails with label: ${labelId} and query: ${query}`);
    const response = await gmail.users.messages.list({
      userId: 'me',
      labelIds: [labelId],
      maxResults: 10,
      q: query,
    });

    if (!response.data.messages) {
      console.log("No emails found.");
      return new Response(JSON.stringify({ messages: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log("Connecting to MongoDB to retrieve user rules and processed emails");
    const db = await connectToDatabase();

    const processedEmailsData = await db.collection('ProcessedEmails').findOne({ userId: user.sub });
    const processedEmailIds = new Set(processedEmailsData?.processedEmails.map(e => e.emailId) || []);

    const userRules = await db
      .collection('Rules')
      .find({ userId: user.sub, status: { $in: [true, "true"] } })
      .toArray();

    const fetchAllMessages = async (response) => {
      return Promise.all(
        response.data.messages.map(async (message) => {
          const msg = await gmail.users.messages.get({
            userId: 'me',
            id: message.id,
          });

          const decodeBase64 = (data) => Buffer.from(data || '', 'base64').toString('utf-8');
          const getMessageBody = (msg) => {
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

          const body = getMessageBody(msg.data);
          return {
            id: msg.data.id,
            threadId: msg.data.threadId,
            subject: msg.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
            from: msg.data.payload.headers.find((h) => h.name === 'From')?.value,
            body,
            snippet: msg.data.snippet,
            timestamp: new Date(parseInt(msg.data.internalDate)),
            isRead: !msg.data.labelIds.includes('UNREAD'),
          };
        })
      );
    };

    if (userRules.length === 0) {
      console.log("No active rules found for this user");
      const messages = await fetchAllMessages(response);
      return new Response(JSON.stringify({ messages }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${userRules.length} active rule(s) for user.`);
    const applyRuleToEmail = async (rule, email) => {
      const primaryTag = rule.tags && rule.tags.length > 0 ? rule.tags[0] : null;
      const action = primaryTag ? primaryTag.label.toLowerCase() : null;

      if (action === "archive") await archiveEmail(gmail, email.id);
      else if (action === "delete") await deleteEmail(gmail, email.id);

      await db.collection('ProcessedEmails').updateOne(
        { userId: user.sub },
        {
          $push: {
            processedEmails: {
              emailId: email.id,
              label: rule.group,
              action,
              timestamp: new Date(),
            },
          },
        },
        { upsert: true }
      );
    };

    const processedEmails = await Promise.all(
      response.data.messages.map(async (message) => {
        if (processedEmailIds.has(message.id)) return null;

        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
        });

        const emailBody = Buffer.from(msg.data.payload?.parts?.[0]?.body?.data || '', 'base64').toString('utf-8');
        for (const rule of userRules) {
          const classification = await classifyEmailContent(emailBody, rule.promptText);
          if (classification.toLowerCase().includes(rule.group.toLowerCase())) {
            await applyRuleToEmail(rule, message);
            break;
          }
        }
        return {
          id: message.id,
          subject: msg.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
          from: msg.data.payload.headers.find((h) => h.name === 'From')?.value,
          body: emailBody,
          snippet: msg.data.snippet,
          timestamp: new Date(parseInt(msg.data.internalDate)),
          isRead: !msg.data.labelIds.includes('UNREAD'),
        };
      })
    );

    const filteredEmails = processedEmails.filter(Boolean);
    if (filteredEmails.length === 0) {
      const messages = await fetchAllMessages(response);
      return new Response(JSON.stringify({ messages }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ messages: filteredEmails }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return new Response(
      JSON.stringify({
        message: 'Internal server error',
        details: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
