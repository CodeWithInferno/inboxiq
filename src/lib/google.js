import { google } from 'googleapis';

// Function to fetch emails from Gmail
export const fetchUserEmails = async (userTokens) => {
  const redirectUri =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api/auth/google/callback' // Development redirect URI
      : 'https://inboxiq-seven.vercel.app/api/auth/google/callback'; // Production redirect URI

  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,

    redirectUri


    );

  );


  client.setCredentials({
    access_token: userTokens.access_token,
    refresh_token: userTokens.refresh_token,
  });

  const gmail = google.gmail({ version: 'v1', auth: client });
  const response = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 10, // Adjust as needed
  });

  const messagePromises = response.data.messages.map(async (message) => {
    const msg = await gmail.users.messages.get({ userId: 'me', id: message.id });

    let body = '';
    
    // Helper function to extract parts
    const getMessageBody = (message) => {
      let htmlPart = null;
      let plainPart = null;

      // If the email has parts, it's multipart, so we need to get the correct one
      if (message.payload.parts) {
        message.payload.parts.forEach((part) => {
          if (part.mimeType === 'text/html') {
            htmlPart = part;
          } else if (part.mimeType === 'text/plain') {
            plainPart = part;
          }
        });
      }

      // Prefer HTML part first, fallback to plain text
      if (htmlPart && htmlPart.body.data) {
        return Buffer.from(htmlPart.body.data, 'base64').toString('utf8');
      } else if (plainPart && plainPart.body.data) {
        return Buffer.from(plainPart.body.data, 'base64').toString('utf8');
      }

      return '';
    };

    body = getMessageBody(msg.data);

    return {
      id: msg.data.id,
      subject: msg.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
      from: msg.data.payload.headers.find((h) => h.name === 'From')?.value,
      body, // Now contains the decoded HTML or plain text
      timestamp: new Date(parseInt(msg.data.internalDate)),
    };
  });

  const messages = await Promise.all(messagePromises);
  return messages;
};
