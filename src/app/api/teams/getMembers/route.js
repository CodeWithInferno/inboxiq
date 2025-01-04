// import { connectToDatabase } from '@/lib/mongodb';
// import { NextResponse } from 'next/server';

// export async function POST(req) {
//   try {
//     // Parse the request body
//     const body = await req.json();
//     const teamId = body.teamId;

//     if (!teamId) {
//       return NextResponse.json(
//         { message: 'Missing required field: teamId' },
//         { status: 400 }
//       );
//     }

//     // Connect to the database
//     const db = await connectToDatabase(process.env.PROFESSIONAL_DB);
//     const teamsCollection = db.collection('Teams');

//     // Find the team where teamId matches directly in the schema
//     const team = await teamsCollection.findOne({ "teamId": teamId });

//     if (!team) {
//       return NextResponse.json(
//         { message: 'Team not found' },
//         { status: 404 }
//       );
//     }

//     // Normalize the Members array
//     const normalizedMembers = (team.Members || []).map((member) => {
//       return {
//         email: member.email || 'N/A',
//         role: member.role || 'unknown',
//         joinedAt: member.joinedAt || null,
//       };
//     });

//     // Return the list of normalized members
//     return NextResponse.json(
//       {
//         message: 'Members fetched successfully',
//         members: normalizedMembers,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error fetching team members:', error);
//     return NextResponse.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
















import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body
    const body = await req.json();
    const teamId = body?.teamId;

    if (!teamId) {
      console.error('Missing teamId in request body:', body); // Add debugging logs
      return NextResponse.json(
        { message: 'Missing required field: teamId' },
        { status: 400 }
      );
    }

    // Connect to the database
    const db = await connectToDatabase(process.env.PROFESSIONAL_DB);
    const teamsCollection = db.collection('Teams');

    // Find the team where teamId matches directly in the schema
    const team = await teamsCollection.findOne({ teamId });

    if (!team) {
      return NextResponse.json(
        { message: 'Team not found' },
        { status: 404 }
      );
    }

    // Normalize the Members array
    const normalizedMembers = (team.Members || []).map((member) => ({
      email: member.email || 'N/A',
      role: member.role || 'unknown',
      joinedAt: member.joinedAt || null,
    }));

    return NextResponse.json(
      {
        message: 'Members fetched successfully',
        members: normalizedMembers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
