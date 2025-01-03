// import { connectToDatabase } from '@/lib/mongodb';
// import { getSession } from '@auth0/nextjs-auth0';
// import { v4 as uuidv4 } from 'uuid';
// import slugify from 'slugify';

// export async function POST(req) {
//   try {
//     // Get user session from Auth0
//     const session = await getSession(req);
//     const user = session?.user;

//     if (!user) {
//       return new Response(JSON.stringify({ message: 'User not authenticated' }), {
//         status: 401,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     // Parse request body
//     const {
//       companyName,
//       departmentName,
//       teamName,
//       privacy,
//       description,
//       defaultPermission,
//       joinApproval,
//     } = await req.json();

//     // Validate required fields
//     if (!companyName || !departmentName || !teamName) {
//       return new Response(
//         JSON.stringify({ message: 'Missing required fields: companyName, departmentName, or teamName' }),
//         { status: 400, headers: { 'Content-Type': 'application/json' } }
//       );
//     }

//     // Connect to the TeamHubDB database
//     const db = await connectToDatabase(process.env.PROFESSIONAL_DB); // Use TeamHubDB
//     const teamsCollection = db.collection('Teams');

//     // Generate unique teamCode
//     let teamCode;
//     let isUnique = false;
//     while (!isUnique) {
//       teamCode = `TEAM_${slugify(teamName, { lower: true, strict: true }).toUpperCase()}_${Math.random()
//         .toString(36)
//         .substr(2, 5)
//         .toUpperCase()}`;

//       // Check if teamCode already exists
//       const existingTeam = await teamsCollection.findOne({ teamCode });
//       if (!existingTeam) {
//         isUnique = true;
//       }
//     }

//     // Generate unique AccessCode
//     let accessCode;
//     isUnique = false;
//     while (!isUnique) {
//       accessCode = Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit numeric code
//       const existingCode = await teamsCollection.findOne({ AccessCode: accessCode });
//       if (!existingCode) {
//         isUnique = true;
//       }
//     }

//     // Generate a unique teamId
//     const teamId = uuidv4();

//     // Create the team document
//     const newTeam = {
//       teamId,
//       companyName,
//       departmentName,
//       teamName,
//       teamCode,
//       privacy,
//       description,
//       defaultPermission,
//       joinApproval,
//       ownerId: user.sub, // Use the Auth0 user ID as the ownerId
//       createdAt: new Date(),
//       AccessCode: accessCode, // Add default AccessCode
//       Members: [user.email], // Initialize Members with the owner's email
//     };

//     // Insert the new team into the TeamHubDB database
//     const result = await teamsCollection.insertOne(newTeam);

//     if (!result.acknowledged) {
//       throw new Error('Failed to insert the team into the database');
//     }

//     // Return the created teamId and teamCode
//     return new Response(JSON.stringify({ teamId, teamCode, accessCode }), {
//       status: 201,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error creating team:', error);
//     return new Response(JSON.stringify({ message: 'Internal server error' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }










import { connectToDatabase } from '@/lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

export async function POST(req) {
  try {
    // Get user session from Auth0
    const session = await getSession(req);
    const user = session?.user;

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const {
      companyName,
      departmentName,
      teamName,
      privacy,
      description,
      defaultPermission,
      joinApproval,
    } = await req.json();

    // Validate required fields
    if (!companyName || !departmentName || !teamName) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields: companyName, departmentName, or teamName' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Connect to the TeamHubDB database
    const db = await connectToDatabase(process.env.PROFESSIONAL_DB); // Use TeamHubDB
    const teamsCollection = db.collection('Teams');

    // Generate unique teamCode
    let teamCode;
    let isUnique = false;
    while (!isUnique) {
      teamCode = `TEAM_${slugify(teamName, { lower: true, strict: true }).toUpperCase()}_${Math.random()
        .toString(36)
        .substr(2, 5)
        .toUpperCase()}`;

      // Check if teamCode already exists
      const existingTeam = await teamsCollection.findOne({ teamCode });
      if (!existingTeam) {
        isUnique = true;
      }
    }

    // Generate unique AccessCode
    let accessCode;
    isUnique = false;
    while (!isUnique) {
      accessCode = Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit numeric code
      const existingCode = await teamsCollection.findOne({ AccessCode: accessCode });
      if (!existingCode) {
        isUnique = true;
      }
    }

    // Generate a unique teamId
    const teamId = uuidv4();

    // Create the team document with the creator as the admin in Members array
    const newTeam = {
      teamId,
      companyName,
      departmentName,
      teamName,
      teamCode,
      privacy,
      description,
      defaultPermission,
      joinApproval,
      ownerId: user.sub, // Use the Auth0 user ID as the ownerId
      createdAt: new Date(),
      AccessCode: accessCode, // Add default AccessCode
      Members: [
        {
          email: user.email,
          role: 'admin', // Assign admin role to the creator
          joinedAt: new Date(), // Track when the creator joined
        },
      ],
    };

    // Insert the new team into the TeamHubDB database
    const result = await teamsCollection.insertOne(newTeam);

    if (!result.acknowledged) {
      throw new Error('Failed to insert the team into the database');
    }

    // Return the created teamId and teamCode
    return new Response(JSON.stringify({ teamId, teamCode, accessCode }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating team:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
