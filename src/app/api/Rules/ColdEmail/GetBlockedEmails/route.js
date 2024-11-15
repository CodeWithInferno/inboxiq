import { connectToDatabase } from '@/lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0';

export async function GET(req) {
  const session = await getSession(req);
  const user = session?.user;

  if (!user) {
    return new Response(JSON.stringify({ message: 'User not authenticated' }), { status: 401 });
  }

  try {
    const db = await connectToDatabase();
    const emails = await db.collection('BlockedEmails').find({ userId: user.sub }).toArray();

    return new Response(JSON.stringify(emails), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal server error', details: error.message }), { status: 500 });
  }
}
