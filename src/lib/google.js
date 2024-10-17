import { google } from 'googleapis';

export const getOAuth2Client = (clientId, clientSecret, redirectUri) => {
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
};

export const fetchUserEmails = async (userTokens) => {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3000/api/auth/google/callback'
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

  const messagePromises = response.data.messages.map((message) =>
    gmail.users.messages.get({ userId: 'me', id: message.id })
  );

  const messages = await Promise.all(messagePromises);
  return messages.map((message) => ({
    id: message.data.id,
    subject: message.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
    from: message.data.payload.headers.find((h) => h.name === 'From')?.value,
    body: message.data.snippet,
    timestamp: new Date(parseInt(message.data.internalDate)),
  }));
};
