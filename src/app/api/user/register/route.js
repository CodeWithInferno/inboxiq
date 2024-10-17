import { getSession } from '@auth0/nextjs-auth0';
import { addUserToDatabase } from '../../../../lib/user';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Get the user session from Auth0
    const session = await getSession(req);
    const user = session?.user;

    console.log('User data from session:', user);

    if (user) {
      // Add user to MongoDB
      await addUserToDatabase(user);
      console.log('User added to MongoDB successfully');

      // Use an absolute URL for redirection
      const baseUrl = process.env.AUTH0_BASE_URL || 'http://localhost:3000';
      return NextResponse.redirect(`${baseUrl}/dashboard`);
    } else {
      console.log('User object is undefined');
      return NextResponse.json(
        { message: 'User object is undefined' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error during user registration:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}
