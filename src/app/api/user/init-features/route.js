// // src/app/api/user/init-features/route.js
// import { connectToDatabase } from '@/lib/mongodb';
// import { getSession } from '@auth0/nextjs-auth0';

// export async function GET(req) {
//   try {
//     const session = await getSession(req);
//     const user = session?.user;

//     if (!user) {
//       return new Response(JSON.stringify({ message: 'User not authenticated' }), {
//         status: 401,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     const db = await connectToDatabase();

//     const defaultFeatures = {
//       classifyPriority: true,
//       classifySpam: true,
//       generateTemplate: true,
//       sentimentAnalysis: true,
//       smartReply: true,
//       emailSummary: true,
//       classify: true,
//     };

//     const result = await db.collection('features').updateOne(
//       { email: user.email },
//       { $setOnInsert: { userId: user.sub, ...defaultFeatures } },
//       { upsert: true }
//     );

//     return new Response(JSON.stringify({ message: 'User features initialized', result }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error initializing user features:', error);
//     return new Response(JSON.stringify({ message: 'Internal server error' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }













import { connectToDatabase } from '@/lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0';

export async function GET(req) {
  try {
    const session = await getSession(req);
    const user = session?.user;

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = await connectToDatabase();

    const defaultFeatures = {
      classifyPriority: true,
      classifySpam: true,
      generateTemplate: true,
      sentimentAnalysis: true,
      smartReply: true,
      emailSummary: true,
      classify: true,
    };

    const result = await db.collection('features').updateOne(
      { email: user.email },
      { $setOnInsert: { userId: user.sub, ...defaultFeatures } },
      { upsert: true }
    );

    // Redirect to /dashboard if features are successfully initialized
    if (result.acknowledged) {
      return new Response(null, {
        status: 302,
        headers: { Location: '/dashboard' },
      });
    }

    // Handle unexpected situations
    return new Response(JSON.stringify({ message: 'Failed to initialize user features' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error initializing user features:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
