import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSession } from '@auth0/nextjs-auth0';

export async function DELETE(req) {
  try {
    const session = await getSession(req);
    const user = session?.user;

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { labelId } = await req.json();

    const db = await connectToDatabase();
    const result = await db.collection('Labels').deleteOne({
      _id: new ObjectId(labelId),
      userId: user.sub, // Ensure the label belongs to the user
    });

    if (result.deletedCount === 1) {
      return new Response(JSON.stringify({ message: 'Label deleted successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ message: 'Failed to delete label' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error deleting label:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
