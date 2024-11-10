// src/app/api/Rules/update-tags/route.js

import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const { ruleId, tags } = await req.json();

    // Connect to the database
    const db = await connectToDatabase();

    // Update the tags for the specified rule
    const result = await db.collection('Rules').updateOne(
      { _id: new ObjectId(ruleId) },
      { $set: { tags: tags } }
    );

    if (result.modifiedCount === 1) {
      return new Response(
        JSON.stringify({ message: 'Tags updated successfully' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ message: 'Failed to update tags' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error updating tags:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
