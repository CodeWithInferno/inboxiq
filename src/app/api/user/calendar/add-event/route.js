import { connectToDatabase } from '@/lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0';

export async function POST(req) {
  try {
    // Get user session
    const session = await getSession(req);
    const user = session?.user;

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse the request body
    const { title, date, startTime, endTime } = await req.json();

    // Validate input
    if (!title || !date || !startTime || !endTime) {
      return new Response(JSON.stringify({ message: 'Missing event details' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Connect to the database
    const db = await connectToDatabase();

    // Event object to insert
    const event = {
      userId: user.sub,
      email: user.email,
      title,
      date,
      startTime,
      endTime,
      createdAt: new Date(),
    };

    // Insert event into the 'Calendar' collection
    const result = await db.collection('Calendar').insertOne(event);

    return new Response(JSON.stringify({ message: 'Event added to calendar', result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error adding event to calendar:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
