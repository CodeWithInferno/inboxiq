// app/api/messages/send/route.js
import { getSession } from '@auth0/nextjs-auth0';
import clientPromise from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const session = await getSession(req);
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { to, subject, body } = await req.json();
    const client = await clientPromise;
    const db = client.db('mySaaSApp');

    const newMessage = {
      userId: user.sub,
      from: user.email,
      to,
      subject,
      body,
      timestamp: new Date(),
      isRead: false,
    };

    const result = await db.collection('messages').insertOne(newMessage);
    return NextResponse.json({ message: 'Message sent', data: result }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
