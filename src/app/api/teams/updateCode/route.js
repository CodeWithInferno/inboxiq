// import { connectToDatabase } from '@/lib/mongodb';
// import { getSession } from '@auth0/nextjs-auth0';
// import slugify from 'slugify';

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
//     const { teamId } = await req.json();

//     if (!teamId) {
//       return new Response(
//         JSON.stringify({ message: 'Missing required field: teamId' }),
//         { status: 400, headers: { 'Content-Type': 'application/json' } }
//       );
//     }

//     // Connect to the database
//     const db = await connectToDatabase();
//     const teamsCollection = db.collection('Teams');

//     // Verify team exists
//     const teamExists = await teamsCollection.findOne({ teamId });
//     if (!teamExists) {
//       return new Response(
//         JSON.stringify({ message: 'Team not found' }),
//         { status: 404, headers: { 'Content-Type': 'application/json' } }
//       );
//     }

//     // Generate unique teamCode
// // Generate unique teamCode
// let newCode;
// let isUnique = false;
// while (!isUnique) {
//   newCode = Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit numeric code
//   const existingTeam = await teamsCollection.findOne({ teamCode: newCode });
//   if (!existingTeam) {
//     isUnique = true;
//   }
// }


//     // Update the team's teamCode in the database
//     const result = await teamsCollection.updateOne(
//       { teamId },
//       { $set: { teamCode: newCode } }
//     );

//     if (result.modifiedCount === 0) {
//       return new Response(
//         JSON.stringify({ message: 'Code not updated. No changes made.' }),
//         { status: 406, headers: { 'Content-Type': 'application/json' } }
//       );
//     }

//     // Return the new team code
//     return new Response(JSON.stringify({ teamCode: newCode }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error updating team code:', error);
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
    const { teamId } = await req.json();

    if (!teamId) {
      return new Response(
        JSON.stringify({ message: 'Missing required field: teamId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Connect to the TeamHubDB database
    const db = await connectToDatabase(process.env.PROFESSIONAL_DB); // Use TeamHubDB
    const teamsCollection = db.collection('Teams');

    // Verify team exists
    const teamExists = await teamsCollection.findOne({ teamId });
    if (!teamExists) {
      return new Response(
        JSON.stringify({ message: 'Team not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique AccessCode
    let newAccessCode;
    let isUnique = false;
    while (!isUnique) {
      newAccessCode = Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit numeric code
      const existingAccessCode = await teamsCollection.findOne({ AccessCode: newAccessCode });
      if (!existingAccessCode) {
        isUnique = true;
      }
    }

    // Update the team's AccessCode in the database
    const result = await teamsCollection.updateOne(
      { teamId },
      { $set: { AccessCode: newAccessCode } }
    );

    if (result.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ message: 'AccessCode not updated. No changes made.' }),
        { status: 406, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return the new AccessCode
    return new Response(JSON.stringify({ AccessCode: newAccessCode }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating AccessCode:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
