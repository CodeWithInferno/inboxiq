import clientPromise from './src/lib/mongodb.js';
import { decryptToken } from './src/utils/crypto.js'; // Adjust path based on your project structure

/**
 * Fetches and decrypts user tokens based on userId for cron jobs.
 * @param {string} userId - The user's unique ID (e.g., `google-oauth2|...`).
 * @returns {object} Decrypted tokens { access_token, refresh_token }.
 * @throws {Error} If tokens are not found or decryption fails.
 */
export default async function getUserTokensForCron(userId) {
  const client = await clientPromise;
  const db = client.db('mySaaSApp'); // Replace 'mySaaSApp' with your DB name if different.

  // Fetch user document by userId
  const user = await db.collection('users').findOne({ userId });

  if (!user || !user.access_token || !user.refresh_token) {
    throw new Error(`User tokens not found for userId: ${userId}`);
  }

  // Ensure tokens have the correct structure before decryption
  if (
    !user.access_token.iv ||
    !user.access_token.encryptedData ||
    !user.refresh_token.iv ||
    !user.refresh_token.encryptedData
  ) {
    throw new Error(`Invalid token format for userId: ${userId}`);
  }

  // Decrypt tokens
  const accessToken = decryptToken(user.access_token);
  const refreshToken = decryptToken(user.refresh_token);

  return { access_token: accessToken, refresh_token: refreshToken };
}
