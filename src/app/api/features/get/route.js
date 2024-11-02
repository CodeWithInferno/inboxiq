"use server";

import { connectToDatabase } from '@/lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0';

export async function GET(req) {
  try {
    const session = await getSession(req);
    const userId = session?.user?.sub;

    if (!userId) {
      return new Response(
        JSON.stringify({ message: 'User not authenticated' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const db = await connectToDatabase();
    const userFeatures = await db.collection('features').findOne({ userId });

    if (!userFeatures) {
      return new Response(
        JSON.stringify({ message: 'Features not found for user' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ features: userFeatures }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching features:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
