// src/app/api/users/register.js
import { getSession } from '@auth0/nextjs-auth0';
import { addUserToDatabase } from '../../../../lib/user';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Get the user session from Auth0
    const session = await getSession(req);
    const user = session?.user;

    if (user) {
      // Add user to MongoDB with default features
      await addUserToDatabase(user);

      // Redirect to the dashboard after adding the user
      const baseUrl = process.env.AUTH0_BASE_URL || 'https://inboxiq-seven.vercel.app';
      return NextResponse.redirect(`${baseUrl}/dashboard`);
    } else {
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
