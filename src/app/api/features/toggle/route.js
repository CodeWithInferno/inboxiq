// import { connectToDatabase } from '@/lib/mongodb';

// export async function POST(req) {
//   try {
//     const { userId, updates } = await req.json();

//     if (!userId || !Array.isArray(updates) || updates.length === 0) {
//       console.error("Invalid request data.");
//       return new Response(JSON.stringify({ message: 'Invalid request data' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     const db = await connectToDatabase();
//     const collection = db.collection('features');

//     console.log("Attempting to update features for user:", userId);

//     // Construct the MongoDB update object with nested fields in `features`
//     const updateFields = updates.reduce((acc, { featureName, enabled }) => {
//       acc[`features.${featureName}`] = enabled;
//       return acc;
//     }, {});

//     // Perform the update operation
//     const result = await collection.updateOne(
//       { userId },
//       { $set: updateFields }
//     );

//     if (result.modifiedCount > 0) {
//       console.log("Features updated successfully.");
//       return new Response(JSON.stringify({ message: 'Features updated successfully' }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     } else if (result.matchedCount > 0) {
//       console.log("Features were already in the desired state.");
//       return new Response(JSON.stringify({ message: 'Features were already in the desired state' }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     } else {
//       console.error("Failed to update features in document.");
//       return new Response(JSON.stringify({ message: 'Failed to update features' }), {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }
//   } catch (error) {
//     console.error('Error updating features:', error);
//     return new Response(
//       JSON.stringify({ message: 'Internal server error', error: error.message }),
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     );
//   }
// }
















import { connectToDatabase } from '@/lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0';

export async function POST(req) {
  try {
    const session = await getSession(req);
    const userId = session?.user?.sub;

    // Parse the incoming request to get modified features
    const { changes } = await req.json();
    console.log("Received changes:", changes);

    if (!userId || !changes || typeof changes !== 'object') {
      console.error("Missing or invalid parameters:", { userId, changes });
      return new Response(JSON.stringify({ message: 'Missing userId or changes' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = await connectToDatabase();
    const collection = db.collection('features');

    // Prepare update fields to modify main feature properties directly
    const updateFields = {};
    for (const [featureName, enabled] of Object.entries(changes)) {
      updateFields[featureName] = enabled; // Set each feature at the top level
    }

    const result = await collection.updateOne(
      { userId },
      { $set: updateFields },
      { upsert: true } // Create the document if it doesn't exist
    );

    console.log("Update result:", result);

    if (result.modifiedCount > 0 || result.upsertedCount > 0) {
      return new Response(JSON.stringify({ message: 'Features updated successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      console.error("Failed to update features in document.");
      return new Response(JSON.stringify({ message: 'Failed to update features' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error updating features:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
