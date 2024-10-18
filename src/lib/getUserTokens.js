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

export default async function getUserTokens(userEmail) {
  const client = await clientPromise;
  const db = client.db('mySaaSApp');

  const user = await db.collection('users').findOne({ email: userEmail });

  if (!user || !user.access_token || !user.refresh_token) {
    throw new Error('User tokens not found');
  }

  return {
    access_token: user.access_token,
    refresh_token: user.refresh_token,
  };
}
