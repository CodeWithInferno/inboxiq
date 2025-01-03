import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { teamId } = await req.json();

    if (!teamId) {
      return new Response(
        JSON.stringify({ message: 'Missing required field: teamId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Connect to the database
    const db = await connectToDatabase();
    const teamsCollection = db.collection('Teams');

    // Find the team with the provided teamId
    const team = await teamsCollection.findOne({ teamId });

    if (!team) {
      return new Response(
        JSON.stringify({ message: 'Team not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Normalize the Members array
    const normalizedMembers = (team.Members || []).map((member) => {
      if (typeof member === 'string') {
        // Convert string email to a standardized member object
        return { email: member, role: 'unknown', joinedAt: null };
      }
      // Return the object as-is for structured member data
      return member;
    });

    // Return the list of normalized members
    return new Response(
      JSON.stringify({ members: normalizedMembers }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching team members:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
