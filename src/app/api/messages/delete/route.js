// src/app/api/messages/delete/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(req) {
  try {
    const { messageId } = await req.json();

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('mySaaSApp');

    // Delete the message using ObjectId
    const result = await db.collection('messages').deleteOne({
      _id: new ObjectId(messageId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { message: 'Failed to delete message', error: error.message },
      { status: 500 }
    );
  }
}
