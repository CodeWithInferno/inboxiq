import { connectToDatabase } from '@/lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0';

export async function GET(req) {
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

    const db = await connectToDatabase();

    // Fetch newsletters from the database
    const record = await db.collection('Newsletters').findOne({ userId: user.sub });

    if (record && record.results) {
      // Process the results to ensure correct counts and consistent format
      const formattedResults = record.results.map((item) => ({
        senderName: item.senderName || 'Unknown Sender',
        senderEmail: item.senderEmail || 'Unknown Email',
        emailIds: Array.isArray(item.emailIds) ? item.emailIds : [],
        count: Array.isArray(item.emailIds) ? item.emailIds.length : 0, // Ensure count reflects current emailIds
        unsubscribable: item.unsubscribable || 'No information provided',
      }));

      return new Response(JSON.stringify({ newsletters: formattedResults }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(
        JSON.stringify({ message: 'No newsletters found for this user', newsletters: [] }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
