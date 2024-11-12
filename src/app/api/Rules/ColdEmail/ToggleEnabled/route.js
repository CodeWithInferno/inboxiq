import { connectToDatabase } from '@/lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0';

export async function POST(req) {
  try {
    const session = await getSession(req);
    const user = session?.user;

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { isEnabled } = await req.json();

    // Connect to the database
    const db = await connectToDatabase();

    // Update or insert the user's Cold Email Blocker state in the collection
    const result = await db.collection('ColdEmail').updateOne(
      { userId: user.sub }, // Filter by user ID
      {
        $set: {
          isEnabled: isEnabled,
          updatedAt: new Date(), // Track the last update time
        },
      },
      { upsert: true } // Insert if no record exists
    );

    return new Response(JSON.stringify({ message: 'Feature state updated successfully', result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating feature state:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
