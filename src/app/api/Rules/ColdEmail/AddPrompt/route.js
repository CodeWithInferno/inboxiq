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

    // Extract promptText, isEnabled, and action from the request body
    const { promptText, isEnabled, action } = await req.json();
    const db = await connectToDatabase();

    // Check if a record for this user already exists
    const existingRecord = await db.collection('ColdEmail').findOne({ userId: user.sub });

    if (existingRecord) {
      // Update existing record
      await db.collection('ColdEmail').updateOne(
        { userId: user.sub },
        {
          $set: {
            prompt: promptText,
            isEnabled,
            action, // Save or update the action field
            updatedAt: new Date(),
          },
        }
      );
    } else {
      // Insert a new record if none exists
      await db.collection('ColdEmail').insertOne({
        userId: user.sub,
        prompt: promptText,
        isEnabled,
        action, // Save the action field for a new record
        createdAt: new Date(),
      });
    }

    return new Response(JSON.stringify({ message: 'Prompt, state, and action saved successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error saving or updating prompt:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
