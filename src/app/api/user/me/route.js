// app/api/user/me/route.js
import { getSession } from '@auth0/nextjs-auth0';
import clientPromise from '../../../../lib/mongodb';

export async function GET(req) {
  try {
    const session = await getSession(req);
    const user = session?.user;

    if (!user) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('mySaaSApp');
    const userData = await db.collection('users').findOne({ userId: user.sub });

    if (!userData) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(userData), { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
