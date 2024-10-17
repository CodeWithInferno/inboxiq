// src/app/api/messages/read/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb'; // Make sure this is imported

export async function PATCH(req) {
  try {
    const { messageId, isRead } = await req.json();

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('mySaaSApp');

    // Update the read status of the message using ObjectId
    const result = await db.collection('messages').updateOne(
      { _id: new ObjectId(messageId) },
      { $set: { isRead } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: 'Message not found or already in this state' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Message read status updated successfully' });
  } catch (error) {
    console.error('Error updating read status:', error);
    return NextResponse.json(
      { message: 'Failed to update read status', error: error.message },
      { status: 500 }
    );
  }
}
