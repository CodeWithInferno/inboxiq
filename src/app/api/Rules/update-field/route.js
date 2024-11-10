// /src/app/api/Rules/update-field.js
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const { ruleId, field, value } = await req.json();

    // Connect to the database
    const db = await connectToDatabase();

    // Perform the update
    const result = await db.collection('Rules').updateOne(
      { _id: new ObjectId(ruleId) },
      { $set: { [field]: value } } // Dynamically set the field
    );

    if (result.modifiedCount === 1) {
      return new Response(JSON.stringify({ message: 'Field updated successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ message: 'Failed to update field' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error updating field:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
