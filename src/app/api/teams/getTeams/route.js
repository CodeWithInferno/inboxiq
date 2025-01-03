// import { connectToDatabase } from '@/lib/mongodb'; // Ensure this points to your MongoDB connection logic
// import { NextResponse } from 'next/server';

// export async function GET(req) {
//   try {
//     // Parse the search query from the request URL
//     const { searchParams } = new URL(req.url);
//     const teamId = searchParams.get('teamId');

//     // Check if the `teamId` is provided
//     if (!teamId) {
//       return NextResponse.json(
//         { message: 'Missing teamId in query' },
//         { status: 400 }
//       );
//     }

//     // Connect to MongoDB
//     const db = await connectToDatabase();

//     // Fetch the team data from the 'Teams' collection
//     const team = await db.collection('Teams').findOne({ teamId });

//     // Check if the team exists
//     if (!team) {
//       return NextResponse.json(
//         { message: `No team found for teamId: ${teamId}` },
//         { status: 404 }
//       );
//     }

//     // Return the full team data
//     return NextResponse.json({
//       message: 'Team fetched successfully',
//       data: team, // Return all team data
//     });
//   } catch (error) {
//     console.error('Error fetching team data:', error);
//     return NextResponse.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }










import { connectToDatabase } from '@/lib/mongodb'; // Ensure this points to your MongoDB connection logic
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Parse the search query from the request URL
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('teamId');

    // Check if the `teamId` is provided
    if (!teamId) {
      return NextResponse.json(
        { message: 'Missing teamId in query' },
        { status: 400 }
      );
    }

    // Connect to the TeamHubDB database
    const db = await connectToDatabase(process.env.PROFESSIONAL_DB); // Use the TeamHubDB database

    // Fetch the team data from the 'Teams' collection
    const team = await db.collection('Teams').findOne({ teamId });

    // Check if the team exists
    if (!team) {
      return NextResponse.json(
        { message: `No team found for teamId: ${teamId}` },
        { status: 404 }
      );
    }

    // Return the full team data
    return NextResponse.json({
      message: 'Team fetched successfully',
      data: team, // Return all team data
    });
  } catch (error) {
    console.error('Error fetching team data:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
