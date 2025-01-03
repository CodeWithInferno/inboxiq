// import { connectToDatabase } from '@/lib/mongodb';
// import { getSession } from '@auth0/nextjs-auth0';

// export async function POST(req) {
//   try {
//     // Authenticate the user
//     const session = await getSession(req);
//     const user = session?.user;

//     if (!user) {
//       return new Response(JSON.stringify({ message: 'User not authenticated' }), {
//         status: 401,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     // Parse request body
//     const { code } = await req.json();

//     if (!code) {
//       return new Response(
//         JSON.stringify({ message: 'Missing required field: code' }),
//         { status: 400, headers: { 'Content-Type': 'application/json' } }
//       );
//     }

//     // Connect to the TeamHubDB database
//     const db = await connectToDatabase(process.env.PROFESSIONAL_DB); // Use TeamHubDB
//     const teamsCollection = db.collection('Teams');

//     // Check if the code matches a team
//     const team = await teamsCollection.findOne({
//       $or: [{ teamCode: code }, { AccessCode: code }], // Check both teamCode and AccessCode
//     });

//     if (!team) {
//       return new Response(
//         JSON.stringify({ message: 'No team found with the provided code' }),
//         { status: 404, headers: { 'Content-Type': 'application/json' } }
//       );
//     }

//     // Add the user's email to the Members array with a default role
//     const userEmail = user.email;
//     const member = {
//       email: userEmail,
//       role: 'member', // Default role
//       joinedAt: new Date(), // Track when the user joined
//     };

//     const result = await teamsCollection.updateOne(
//       { _id: team._id },
//       { $addToSet: { Members: member } } // Add member only if not already present
//     );

//     if (result.modifiedCount === 0) {
//       return new Response(
//         JSON.stringify({ message: 'Failed to add member to the team' }),
//         { status: 500, headers: { 'Content-Type': 'application/json' } }
//       );
//     }

//     // Return success response
//     return new Response(
//       JSON.stringify({ message: 'Successfully joined the team', teamId: team.teamId }),
//       { status: 200, headers: { 'Content-Type': 'application/json' } }
//     );
//   } catch (error) {
//     console.error('Error joining team:', error);
//     return new Response(
//       JSON.stringify({ message: 'Internal server error' }),
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     );
//   }
// }














import { connectToDatabase } from '@/lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0';

export async function POST(req) {
  try {
    // Authenticate the user
    const session = await getSession(req);
    const user = session?.user;

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const { code } = await req.json();

    if (!code) {
      return new Response(
        JSON.stringify({ message: 'Missing required field: code' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Connect to the TeamHubDB database
    const teamHubDB = await connectToDatabase(process.env.PROFESSIONAL_DB);
    const teamsCollection = teamHubDB.collection('Teams');

    // Check if the code matches a team
    const team = await teamsCollection.findOne({
      $or: [{ teamCode: code }, { AccessCode: code }],
    });

    if (!team) {
      return new Response(
        JSON.stringify({ message: 'No team found with the provided code' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Add the user's email to the Members array in TeamHubDB
    const userEmail = user.email;
    const member = {
      email: userEmail,
      role: 'member',
      joinedAt: new Date(),
    };

    const teamUpdateResult = await teamsCollection.updateOne(
      { _id: team._id },
      { $addToSet: { Members: member } } // Add the user to Members array if not already present
    );

    if (teamUpdateResult.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ message: 'Failed to add member to the team' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Connect to the mySaaSApp database
    const mySaaSAppDB = await connectToDatabase(process.env.BASIC_DB);
    const usersCollection = mySaaSAppDB.collection('Users');

    // Add the team details to the user's document in mySaaSApp
    const teamDetails = {
      teamId: team.teamId,
      role: 'member', // Default role
      companyName: team.companyName,
      teamName: team.teamName,
      joinedAt: new Date(),
    };

    const userUpdateResult = await usersCollection.updateOne(
      { email: userEmail },
      {
        $setOnInsert: {
          email: userEmail,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // Ensure new user document is created if it doesn't exist
        $addToSet: { teams: teamDetails }, // Add the team details if not already present
        $set: { updatedAt: new Date() }, // Update the timestamp
      },
      { upsert: true } // Create the user document if it doesn't exist
    );

    if (userUpdateResult.modifiedCount === 0 && userUpdateResult.upsertedCount === 0) {
      return new Response(
        JSON.stringify({ message: 'Failed to update user data in mySaaSApp' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({ message: 'Successfully joined the team', teamId: team.teamId }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error joining team:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
