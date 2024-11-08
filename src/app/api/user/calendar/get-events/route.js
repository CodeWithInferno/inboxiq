import { connectToDatabase } from '@/lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0';

export async function GET(req) {
  try {
    // Retrieve the user session
    const session = await getSession(req);
    const user = session?.user;

    // If user is not authenticated, return an error
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Connect to the database
    const db = await connectToDatabase();

    // Find events associated with the user's email
    const events = await db.collection('Calendar').find({ email: user.email }).toArray();

    // Return the events as JSON
    return new Response(JSON.stringify({ events }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
