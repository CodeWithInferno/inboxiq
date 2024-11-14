// import { google } from 'googleapis';

// export async function GET(req) {
//   try {
//     console.log('Redirecting to Google OAuth consent screen');

//     const oauth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET,
//       'https://localhost:3000/api/auth/google/callback' // The same URL should be set in your Google Cloud console
//     );

//     const authUrl = oauth2Client.generateAuthUrl({
//       access_type: 'offline',
//       scope: [
//         'https://www.googleapis.com/auth/gmail.readonly',
//         'https://www.googleapis.com/auth/userinfo.profile', // User profile scope
//         'https://www.googleapis.com/auth/userinfo.email',   // User email scope
//         'https://www.googleapis.com/auth/gmail.modify',
//         'https://www.googleapis.com/auth/gmail.compose',
//         'https://www.googleapis.com/auth/gmail.send',
//         'https://www.googleapis.com/auth/gmail.labels',
//         'https://www.googleapis.com/auth/gmail.compose',
//         'https://www.googleapis.com/auth/gmail.modify',
//         'https://mail.google.com/'
//       ],
//       prompt: 'consent',
//     });
    
//     // Redirect the user to the Google OAuth URL
//     return new Response(null, {
//       status: 302,
//       headers: {
//         Location: authUrl,
//       },
//     });
//   } catch (error) {
//     console.error('Error during Google OAuth redirection:', error);
//     return new Response(JSON.stringify({ error: 'Internal server error' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }














import { google } from 'googleapis';

export async function GET(req) {
  try {
    console.log('Redirecting to Google OAuth consent screen');

    const redirectUri =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api/auth/google/callback' // Development redirect URI
        : 'https://https://inboxiq-seven.vercel.app/api/auth/google/callback'; // Production redirect URI

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.compose',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.labels',
        'https://mail.google.com/'
      ],
      prompt: 'consent',
    });
    
    return new Response(null, {
      status: 302,
      headers: {
        Location: authUrl,
      },
    });
  } catch (error) {
    console.error('Error during Google OAuth redirection:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

