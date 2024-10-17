import { connectToDatabase } from '@/lib/database';

export async function GET(req) {
  try {
    console.log('Received GET request at /api/user/tokens');

    // Extract email from query parameters
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const email = searchParams.get('email');

    // Check if the email query parameter is provided
    if (!email) {
      console.log('Missing email parameter');
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Fetching tokens for email:', email);

    // Connect to the database
    const db = await connectToDatabase();

    // Find the user by email
    const user = await db.collection('users').findOne({ email });

    // Check if user and tokens are found
    if (!user || !user.access_token || !user.refresh_token) {
      console.log('User or tokens not found for email:', email);
      return new Response(JSON.stringify({ error: 'Tokens not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Tokens found for user:', user);

    // Return the tokens in the response
    return new Response(
      JSON.stringify({
        access_token: user.access_token,
        refresh_token: user.refresh_token,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in /api/user/tokens:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to retrieve user tokens',
        details: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
