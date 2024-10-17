// app/api/messages/inbox/route.js
import { getSession } from '@auth0/nextjs-auth0';
import clientPromise from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const session = await getSession(req);
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('mySaaSApp');

    // Retrieve all messages where the user is the recipient
    const messages = await db.collection('messages').find({ to: user.email }).toArray();
    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving messages:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
