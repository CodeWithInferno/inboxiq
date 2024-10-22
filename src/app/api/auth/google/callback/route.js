import { google } from 'googleapis';
import { connectToDatabase } from '@/lib/database';
import axios from 'axios'; // Use axios for more control over API requests

export async function GET(req, res) {
  try {
    // Extract the authorization code from the query parameters
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const code = searchParams.get('code');

    if (!code) {
      return new Response(JSON.stringify({ message: 'Authorization code is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Authorization code:', code);

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:3000/api/auth/google/callback'
    );

    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Log the tokens
    console.log('Tokens received:', tokens);

    // Manually set the access token in the request using axios
    const accessToken = tokens.access_token;

    if (!accessToken) {
      return new Response(JSON.stringify({ message: 'Access token not found' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Retrieve user info from Google using axios with the access token
    let userInfo;
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      userInfo = response.data;
      console.log('User info:', userInfo);
    } catch (userInfoError) {
      console.error('Error retrieving user info:', userInfoError.response?.data || userInfoError.message);
      return new Response(JSON.stringify({ message: 'Failed to retrieve user info' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userEmail = userInfo.email;

    // Save tokens in MongoDB
    try {
      const db = await connectToDatabase();

      const result = await db.collection('users').updateOne(
        { email: userEmail }, // Filter by user's email
        {
          $set: {
            userId: userInfo.id,
            email: userEmail,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0 || result.modifiedCount > 0) {
        console.log('Tokens successfully stored for user:', userEmail);
        return new Response(JSON.stringify({ message: 'User tokens saved successfully' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        console.error('Failed to store tokens, no updates made.');
        return new Response(JSON.stringify({ message: 'Failed to store tokens in database' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch (dbError) {
      console.error('MongoDB error:', dbError);
      return new Response(JSON.stringify({ message: 'Failed to save tokens in the database' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error handling callback:', error);
    return new Response(JSON.stringify({ message: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}






// import { google } from 'googleapis';
// import { connectToDatabase } from '@/lib/mongodb';
// import axios from 'axios';

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
//     const code = searchParams.get('code');

//     if (!code) {
//       return new Response(JSON.stringify({ message: 'Authorization code is required' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     const oauth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET,
//       'http://localhost:3000/api/auth/google/callback'
//     );

//     // Exchange authorization code for tokens
//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);

//     const accessToken = tokens.access_token;

//     if (!accessToken) {
//       return new Response(JSON.stringify({ message: 'Access token not found' }), {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     // Retrieve user info using axios
//     const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });

//     const userInfo = response.data;
//     const userEmail = userInfo.email;

//     // Save tokens in MongoDB
//     const db = await connectToDatabase();
//     const result = await db.collection('users').updateOne(
//       { email: userEmail },
//       {
//         $set: {
//           userId: userInfo.id,
//           email: userEmail,
//           access_token: tokens.access_token,
//           refresh_token: tokens.refresh_token,
//           updatedAt: new Date(),
//         },
//       },
//       { upsert: true }
//     );

//     return result.upsertedCount > 0 || result.modifiedCount > 0
//       ? new Response(JSON.stringify({ message: 'User tokens saved successfully' }), { status: 200 })
//       : new Response(JSON.stringify({ message: 'Failed to store tokens in database' }), { status: 500 });
//   } catch (error) {
//     console.error('Error handling callback:', error);
//     return new Response(JSON.stringify({ message: 'Internal server error', details: error.message }), {
//       status: 500,
//     });
//   }
// }