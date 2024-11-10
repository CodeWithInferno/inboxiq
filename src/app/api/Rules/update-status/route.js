// import { connectToDatabase } from '@/lib/mongodb';
// import { getSession } from '@auth0/nextjs-auth0';

// export async function POST(req) {
//   try {
//     const session = await getSession(req);
//     const user = session?.user;

//     if (!user) {
//       return new Response(JSON.stringify({ message: 'User not authenticated' }), {
//         status: 401,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     const { ruleId, enabled, threading } = await req.json();

//     const db = await connectToDatabase();
//     const result = await db.collection('Rules').updateOne(
//       { _id: ruleId, userId: user.sub },
//       { $set: { enabled, threading } }
//     );

//     return new Response(JSON.stringify({ message: 'Rule updated', result }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error updating rule:', error);
//     return new Response(JSON.stringify({ message: 'Internal server error' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }














import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const { ruleId, status } = await req.json();

    const db = await connectToDatabase();

    const result = await db.collection('Rules').updateOne(
      { _id: new ObjectId(ruleId) },
      { $set: { status } }
    );

    if (result.modifiedCount === 1) {
      return new Response(JSON.stringify({ message: 'Rule status updated successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ message: 'Failed to update rule status' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error updating rule status:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
