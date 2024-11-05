import { getAccessToken } from '@auth0/nextjs-auth0';
import { google } from 'googleapis';

export default async function handler(req, res) {
  console.log('Request method:', req.method); // Debug log to check request method
  
  // Check if the request method is GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query, email } = req.query;

  if (!query || !email) {
    return res.status(400).json({ error: 'Missing query or email parameters' });
  }

  try {
    // Retrieve the access token
    const { accessToken } = await getAccessToken(req, res);
    
    // Initialize the Gmail API client
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: 'v1', auth });

    // Fetch emails that match the search query
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 5, // Limit the number of suggestions
    });

    const messages = response.data.messages || [];

    // Fetch subject and snippet for each message
    const suggestions = await Promise.all(
      messages.map(async (msg) => {
        const msgDetails = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
        });
        return {
          id: msg.id,
          subject: msgDetails.data.payload.headers.find(header => header.name === 'Subject')?.value || '(No Subject)',
          snippet: msgDetails.data.snippet,
        };
      })
    );

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Error fetching suggestions' });
  }
}






