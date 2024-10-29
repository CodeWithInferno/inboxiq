// // src/lib/user.js
// import clientPromise from './mongodb';

// export async function addUserToDatabase(user) {
//   try {
//     console.log('Connecting to MongoDB...');
//     const client = await clientPromise;
//     const db = client.db('mySaaSApp');
//     console.log('Connected to MongoDB:', db.databaseName);

//     // Check if the user already exists in the database
//     const existingUser = await db.collection('users').findOne({ userId: user.sub });
//     console.log('Existing user check:', existingUser);

//     if (!existingUser) {
//       const result = await db.collection('users').insertOne({
//         userId: user.sub,
//         name: user.name,
//         email: user.email,
//         picture: user.picture,
//         createdAt: new Date(),
//       });
//       console.log('User added to the database:', result);
//     } else {
//       console.log('User already exists in the database:', user.email);
//     }
//   } catch (error) {
//     console.error('Error adding user to the database:', error);
//   }
// }



import clientPromise from './mongodb';

export async function addUserToDatabase(user) {
  try {
    const client = await clientPromise;
    const db = client.db('mySaaSApp');

    // Check if the user already exists
    const existingUser = await db.collection('users').findOne({ userId: user.sub });

    if (!existingUser) {
      await db.collection('users').insertOne({
        userId: user.sub,
        name: user.name,
        email: user.email,
        picture: user.picture,
        createdAt: new Date(),
      });

      console.log('User added to the database:', user.email);

      // Initialize default features for this new user
      await initializeUserFeatures(user.sub);
    } else {
      console.log('User already exists in the database:', user.email);
    }
  } catch (error) {
    console.error('Error adding user to the database:', error);
  }
}
