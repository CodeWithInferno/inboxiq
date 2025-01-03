// import { MongoClient } from 'mongodb';
// import dotenv from 'dotenv';

// // Load environment variables only if not in Next.js (Node.js environment)
// if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'development') {
//   dotenv.config({ path: '.env.local' }); // Explicitly load the .env.local file
// }

// const uri = process.env.MONGODB_URI;

// let client;
// let clientPromise;

// if (!uri) {
//   throw new Error('Please add your Mongo URI to the .env.local file');
// }

// if (process.env.NODE_ENV === 'development') {
//   // In development mode, use a global variable to preserve the MongoClient across module reloads
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri);
//     global._mongoClientPromise = client.connect();
//   }
//   clientPromise = global._mongoClientPromise;
// } else {
//   // In production mode, avoid using a global variable
//   client = new MongoClient(uri);
//   clientPromise = client.connect();
// }

// export async function connectToDatabase() {
//   if (!client) {
//     client = await clientPromise;
//   }
//   const db = client.db('mySaaSApp'); // Replace with your database name if different
//   return db;
// }

// export default clientPromise;










import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables only if not in Next.js (Node.js environment)
if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'development') {
  dotenv.config({ path: '.env.local' });
}

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (!uri) {
  throw new Error('Please add your Mongo URI to the .env.local file');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// Dynamic database connection
export async function connectToDatabase(dbName = 'mySaaSApp') {
  if (!client) {
    client = await clientPromise;
  }
  const db = client.db(dbName); // Dynamically select the database
  return db;
}

export default clientPromise;
