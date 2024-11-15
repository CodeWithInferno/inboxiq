// import clientPromise from './mongodb';

// export default async function getUserTokens(userEmail) {
//   const client = await clientPromise;
//   const db = client.db('mySaaSApp');
  
//   const user = await db.collection('users').findOne({ email: userEmail });
  
//   if (!user || !user.access_token || !user.refresh_token) {
//     throw new Error('User tokens not found');
//   }
  
//   return {
//     access_token: user.access_token,
//     refresh_token: user.refresh_token,
//   };
// }





// import clientPromise from './mongodb';

// export default async function getUserTokens(userEmail) {
//   const client = await clientPromise;
//   const db = client.db('mySaaSApp');

//   const user = await db.collection('users').findOne({ email: userEmail });

//   if (!user || !user.access_token || !user.refresh_token) {
//     throw new Error('User tokens not found');
//   }

//   return {
//     access_token: user.access_token,
//     refresh_token: user.refresh_token,
//   };
// }












import clientPromise from './mongodb';
import { google } from 'googleapis';
import { decryptToken, encryptToken } from '@/utils/crypto'; // Import encryption utilities

export default async function getUserTokens(userEmail) {
  const client = await clientPromise;
  const db = client.db('mySaaSApp');

  // Fetch the user document from the database
  const user = await db.collection('users').findOne({ email: userEmail });

  if (!user || !user.access_token || !user.refresh_token) {
    throw new Error('User tokens not found');
  }

  // Ensure access_token and refresh_token are objects with iv and encryptedData
  if (
    typeof user.access_token !== 'object' ||
    !user.access_token.iv ||
    !user.access_token.encryptedData ||
    typeof user.refresh_token !== 'object' ||
    !user.refresh_token.iv ||
    !user.refresh_token.encryptedData
  ) {
    throw new Error('Invalid token format in database');
  }

  // Decrypt tokens
  const accessToken = decryptToken(user.access_token);
  const refreshToken = decryptToken(user.refresh_token);

  // Check if the access token is expired
  const tokenExpiry = user.updatedAt
    ? new Date(user.updatedAt).getTime() + user.expires_in * 1000
    : 0;

  if (Date.now() < tokenExpiry) {
    // Token is still valid
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  // Access token has expired, refresh it
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    const { credentials } = await oauth2Client.refreshAccessToken(); // Refresh the token
    const newAccessToken = credentials.access_token;

    // Encrypt the new access token
    const encryptedAccessToken = encryptToken(newAccessToken);

    // Update the database with the new access token and expiration time
    await db.collection('users').updateOne(
      { email: userEmail },
      {
        $set: {
          access_token: encryptedAccessToken,
          updatedAt: new Date(),
          expires_in: credentials.expiry_date
            ? Math.floor((credentials.expiry_date - Date.now()) / 1000)
            : 3600, // Default to 1 hour if expiry_date is not provided
        },
      }
    );

    // Return the updated tokens
    return { access_token: newAccessToken, refresh_token: refreshToken };
  } catch (error) {
    console.error('Failed to refresh access token:', error.message);
    throw new Error('Unable to refresh access token');
  }
}











