// import { connectToDatabase } from '@/lib/mongodb';
// import { getSession } from '@auth0/nextjs-auth0';

// export async function POST(req) {
//   try {
//     // Get user session
//     const session = await getSession(req);
//     const user = session?.user;

//     if (!user) {
//       return new Response(JSON.stringify({ message: 'User not authenticated' }), {
//         status: 401,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     // Parse the request body
//     const { promptText } = await req.json();

//     // Validate input
//     if (!promptText) {
//       return new Response(JSON.stringify({ message: 'Prompt text is required' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     // Connect to the database
//     const db = await connectToDatabase();

//     // Rule object to insert
//     const rule = {
//       userId: user.sub, 
//       promptText,
//       createdAt: new Date(),
//     };

//     // Insert rule into the 'Rules' collection
//     const result = await db.collection('Rules').insertOne(rule);

//     return new Response(JSON.stringify({ message: 'Rule saved successfully', result }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error saving rule:', error);
//     return new Response(JSON.stringify({ message: 'Internal server error' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }

















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

    // Parse the request body
    const { promptText, action, group, name, status } = await req.json();

    // Split the promptText into individual lines
    const prompts = promptText.trim().split('\n').filter(Boolean);

    // Connect to the database
    const db = await connectToDatabase();

    // Create a list of rule documents to insert
    const rules = prompts.map((description) => ({
      userId: user.sub,
      promptText: description,
      description, // Store each line as its own description
      action,
      group,
      name,
      status: status || false,
      createdAt: new Date(),
    }));

    // Insert each prompt as a separate document
    const result = await db.collection('Rules').insertMany(rules);

    return new Response(JSON.stringify({ message: 'Rules added successfully', result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error adding rules:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
