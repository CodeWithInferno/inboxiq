// src/app/api/Rules/update-category.js

import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const { ruleId, category } = await req.json();

    const db = await connectToDatabase();
    const result = await db.collection('Rules').updateOne(
      { _id: new ObjectId(ruleId) },
      { $set: { category } }
    );

    if (result.modifiedCount === 1) {
      return new Response(JSON.stringify({ message: 'Category updated successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ message: 'Failed to update category' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error updating category:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
