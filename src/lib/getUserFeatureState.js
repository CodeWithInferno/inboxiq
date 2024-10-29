import { connectToDatabase } from './mongodb';

export async function getUserFeatureState(userId, featureName) {
  const db = await connectToDatabase();
  const userDoc = await db.collection('features').findOne({ userId });

  // Return the feature state if it exists; otherwise, assume it's disabled
  return userDoc ? userDoc[featureName] === true : false;
}
