// src/app/api/test/route.js
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('mySaaSApp'); // Replace with your database name

    // Fetch the list of collections as a simple test
    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      message: 'Connected to MongoDB successfully!',
      collections: collections.map(col => col.name),
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return NextResponse.json(
      { message: 'Error connecting to MongoDB', error: error.message },
      { status: 500 }
    );
  }
}
